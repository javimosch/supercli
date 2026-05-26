// executor.zig — Process adapter: spawn command + capture output or passthrough.
// Mirrors the logic in cli/adapters/process.js.
const std = @import("std");
const config = @import("config.zig");

pub const ExecResult = union(enum) {
    // JSON output from the process
    json: std.json.Value,
    // Raw text output
    raw: []const u8,
    // Process ran in passthrough mode (stdio inherited)
    passthrough: void,
    // Error from the process
    err: struct {
        message: []const u8,
        exit_code: u8,
    },
};

pub const ExecOptions = struct {
    // Extra args to prepend (baseArgs from adapterConfig)
    base_args: []const []const u8 = &.{},
    // Extra args to append (user flags translated to --key=val)
    extra_args: []const []const u8 = &.{},
    // Whether to inherit stdio (passthrough mode)
    passthrough: bool = false,
    // Whether to parse stdout as JSON
    parse_json: bool = true,
    // Optional env additions
    env_extra: []const [2][]const u8 = &.{},
    // Timeout in ms (default 15s)
    timeout_ms: u64 = 15000,
    // Working directory (null = current)
    cwd: ?[]const u8 = null,
    // Non-TTY safety options
    requires_interactive: bool = false,
    interactive_flags: []const []const u8 = &.{},
};

// Build CLI flag args from a parsed flags map (key -> value).
// Positional args (per arg_defs) are appended as bare values; all others
// are emitted as --key value (two separate args for broadest binary compat).
pub fn buildFlagArgs(
    gpa: std.mem.Allocator,
    flags: std.StringHashMap([]const u8),
    skip_keys: []const []const u8,
    arg_defs: []const ArgDef,
) ![][]const u8 {
    // Collect positional values first (in arg_defs order), then named flags
    var positionals: std.ArrayList([]const u8) = .empty;
    var named: std.ArrayList([]const u8) = .empty;

    // Build a set of positional arg names for fast lookup
    var pos_set = std.StringHashMap(bool).init(gpa);
    defer pos_set.deinit();
    for (arg_defs) |def| {
        if (def.positional) try pos_set.put(def.name, true);
    }

    // Positional args — in order defined in arg_defs
    for (arg_defs) |def| {
        if (!def.positional) continue;
        if (flags.get(def.name)) |v| {
            if (v.len > 0 and !std.mem.eql(u8, v, "true") and !std.mem.eql(u8, v, "false")) {
                try positionals.append(gpa, try gpa.dupe(u8, v));
            }
        }
    }

    // Named flags
    var iter = flags.iterator();
    while (iter.next()) |entry| {
        const k = entry.key_ptr.*;
        // Skip reserved / supercli-internal flags
        var skip = false;
        for (skip_keys) |sk| {
            if (std.mem.eql(u8, k, sk)) { skip = true; break; }
        }
        if (skip) continue;
        // Skip positional args (already handled above)
        if (pos_set.contains(k)) continue;
        const v = entry.value_ptr.*;
        if (v.len == 0) continue;
        if (std.mem.eql(u8, v, "true")) {
            try named.append(gpa, try std.fmt.allocPrint(gpa, "--{s}", .{k}));
        } else if (!std.mem.eql(u8, v, "false")) {
            try named.append(gpa, try std.fmt.allocPrint(gpa, "--{s}", .{k}));
            try named.append(gpa, try gpa.dupe(u8, v));
        }
    }

    // Merge: positionals first, then named
    var result: std.ArrayList([]const u8) = .empty;
    for (positionals.items) |a| try result.append(gpa, a);
    for (named.items) |a| try result.append(gpa, a);
    return result.toOwnedSlice(gpa);
}

// Execute a command via the process adapter.
// Returns ExecResult. Caller owns any allocations inside.
pub fn executeProcess(
    io: std.Io,
    gpa: std.mem.Allocator,
    binary: []const u8,
    opts: ExecOptions,
) !ExecResult {
    // Build argv
    var argv: std.ArrayList([]const u8) = .empty;
    try argv.append(gpa, binary);
    for (opts.base_args) |a| try argv.append(gpa, a);
    for (opts.extra_args) |a| try argv.append(gpa, a);
    const argv_slice = try argv.toOwnedSlice(gpa);

    // Validate non-TTY safety before spawning
    try validateNonTtySafety(io, gpa, opts.requires_interactive, opts.interactive_flags, argv_slice);

    if (opts.passthrough) {
        var child = try std.process.spawn(io, .{
            .argv = argv_slice,
            .stdin = .inherit,
            .stdout = .inherit,
            .stderr = .inherit,
            .cwd = if (opts.cwd) |c| .{ .path = c } else .inherit,
        });

        // Background thread to monitor timeout
        const TimeoutContext = struct {
            mutex: std.Io.Mutex = .{
                .state = std.atomic.Value(std.Io.Mutex.State).init(.unlocked),
            },
            completed: bool = false,
            child: *std.process.Child,
            io: std.Io,
            timeout_ms: u64,
        };

        const timeout_fn = struct {
            fn run(ctx: *TimeoutContext) void {
                const start_time = std.Io.Timestamp.now(ctx.io, .real).toMilliseconds();
                const timeout_limit = @as(i64, @intCast(ctx.timeout_ms));
                while (true) {
                    ctx.mutex.lock(ctx.io) catch return;
                    if (ctx.completed) {
                        ctx.mutex.unlock(ctx.io);
                        return;
                    }
                    const elapsed = std.Io.Timestamp.now(ctx.io, .real).toMilliseconds() - start_time;
                    if (elapsed >= timeout_limit) {
                        // Kill child process
                        if (ctx.child.id) |pid| {
                            std.posix.kill(pid, .KILL) catch {};
                        }
                        ctx.mutex.unlock(ctx.io);
                        return;
                    }
                    ctx.mutex.unlock(ctx.io);
                    // Sleep for 10ms
                    ctx.io.sleep(std.Io.Duration.fromMilliseconds(10), .awake) catch {};
                }
            }
        }.run;

        var ctx = TimeoutContext{
            .child = &child,
            .io = io,
            .timeout_ms = opts.timeout_ms,
        };

        const thread = try std.Thread.spawn(.{}, timeout_fn, .{&ctx});
        
        const term = child.wait(io) catch |err| {
            ctx.mutex.lock(io) catch {};
            ctx.completed = true;
            ctx.mutex.unlock(io);
            thread.join();
            return err;
        };

        ctx.mutex.lock(io) catch {};
        const timed_out = !ctx.completed and switch (term) {
            .signal => |sig| sig == .KILL,
            else => false,
        };
        ctx.completed = true;
        ctx.mutex.unlock(io);
        thread.join();

        if (timed_out) {
            return ExecResult{ .err = .{
                .message = try std.fmt.allocPrint(gpa, "Process timed out after {d}ms", .{opts.timeout_ms}),
                .exit_code = 124,
            } };
        }

        const exit_code: u8 = switch (term) {
            .exited => |c| c,
            else => 1,
        };

        if (exit_code != 0) {
            return ExecResult{ .err = .{
                .message = try std.fmt.allocPrint(gpa, "Process exited with code {d}", .{exit_code}),
                .exit_code = exit_code,
            } };
        }

        return ExecResult{ .passthrough = {} };
    }

    // Capture mode
    const timeout = std.Io.Timeout{
        .duration = .{
            .raw = std.Io.Duration.fromMilliseconds(@intCast(opts.timeout_ms)),
            .clock = .real,
        },
    };

    const result = std.process.run(gpa, io, .{
        .argv = argv_slice,
        .cwd = if (opts.cwd) |c| .{ .path = c } else .inherit,
        .stdout_limit = .unlimited,
        .stderr_limit = .unlimited,
        .timeout = timeout,
    }) catch |err| {
        if (err == error.Timeout) {
            return ExecResult{ .err = .{
                .message = try std.fmt.allocPrint(gpa, "Process timed out after {d}ms", .{opts.timeout_ms}),
                .exit_code = 124,
            } };
        }
        return err;
    };

    const exit_code: u8 = switch (result.term) {
        .exited => |c| c,
        else => 1,
    };

    if (exit_code != 0) {
        const msg = if (result.stderr.len > 0)
            try gpa.dupe(u8, std.mem.trim(u8, result.stderr, "\n\r "))
        else
            try std.fmt.allocPrint(gpa, "Process exited with code {d}", .{exit_code});
        return ExecResult{ .err = .{ .message = msg, .exit_code = exit_code } };
    }

    const stdout = std.mem.trim(u8, result.stdout, "\n\r ");

    if (!opts.parse_json or stdout.len == 0) {
        return ExecResult{ .raw = try gpa.dupe(u8, stdout) };
    }

    // Try to parse as JSON
    if (std.json.parseFromSliceLeaky(std.json.Value, gpa, stdout, .{})) |parsed| {
        return ExecResult{ .json = parsed };
    } else |_| {
        return ExecResult{ .raw = try gpa.dupe(u8, stdout) };
    }
}

// A single command arg definition from plugin.json args[] array
pub const ArgDef = struct {
    name: []const u8,
    positional: bool = false,  // true = value goes as positional after baseArgs, not --name val
    required: bool = false,
    is_bool: bool = false,
};

// Extract adapterConfig fields needed for execution
pub const AdapterConfig = struct {
    command: []const u8 = "",
    base_args: [][]const u8 = &.{},
    arg_defs: []ArgDef = &.{},   // from plugin args[] — used to detect positional args
    passthrough: bool = false,
    parse_json: bool = true,
    timeout_ms: u64 = 15000,
    cwd: ?[]const u8 = null,
    missing_dep_help: []const u8 = "",
    requires_interactive: bool = false,
    interactive_flags: [][]const u8 = &.{},
};

// Parse the args[] array from a command definition to extract ArgDefs
pub fn parseArgDefs(gpa: std.mem.Allocator, args_raw: ?std.json.Value) ![]ArgDef {
    var list: std.ArrayList(ArgDef) = .empty;
    const arr = switch (args_raw orelse return list.toOwnedSlice(gpa)) {
        .array => |a| a,
        else => return list.toOwnedSlice(gpa),
    };
    for (arr.items) |item| {
        const obj = switch (item) {
            .object => |o| o,
            else => continue,
        };
        const name = if (obj.get("name")) |nv| switch (nv) {
            .string => |s| try gpa.dupe(u8, s),
            else => continue,
        } else continue;
        const positional = if (obj.get("positional")) |pv| switch (pv) {
            .bool => |b| b,
            else => false,
        } else false;
        const required = if (obj.get("required")) |rv| switch (rv) {
            .bool => |b| b,
            else => false,
        } else false;
        const is_bool = if (obj.get("type")) |tv| switch (tv) {
            .string => |s| std.mem.eql(u8, s, "boolean"),
            else => false,
        } else false;
        try list.append(gpa, ArgDef{ .name = name, .positional = positional, .required = required, .is_bool = is_bool });
    }
    return list.toOwnedSlice(gpa);
}

pub fn parseAdapterConfig(gpa: std.mem.Allocator, raw: ?std.json.Value) !AdapterConfig {
    var cfg = AdapterConfig{};
    const obj = switch (raw orelse return cfg) {
        .object => |o| o,
        else => return cfg,
    };

    if (obj.get("command")) |v| switch (v) {
        .string => |s| { cfg.command = try gpa.dupe(u8, s); },
        else => {},
    };

    if (obj.get("passthrough")) |v| switch (v) {
        .bool => |b| { cfg.passthrough = b; },
        else => {},
    };

    if (obj.get("parseJson")) |v| switch (v) {
        .bool => |b| { cfg.parse_json = b; },
        else => {},
    };

    if (obj.get("timeout_ms")) |v| switch (v) {
        .integer => |n| { cfg.timeout_ms = @intCast(@max(0, n)); },
        .float => |f| { cfg.timeout_ms = @intFromFloat(@max(0.0, f)); },
        else => {},
    };

    if (obj.get("cwd")) |v| switch (v) {
        .string => |s| {
            // "invoke_cwd" means use the current working directory (already the default)
            if (!std.mem.eql(u8, s, "invoke_cwd") and !std.mem.eql(u8, s, "plugin_dir")) {
                cfg.cwd = try gpa.dupe(u8, s);
            }
        },
        else => {},
    };

    if (obj.get("missingDependencyHelp")) |v| switch (v) {
        .string => |s| { cfg.missing_dep_help = try gpa.dupe(u8, s); },
        else => {},
    };

    if (obj.get("baseArgs")) |v| switch (v) {
        .array => |arr| {
            var base: std.ArrayList([]const u8) = .empty;
            for (arr.items) |item| switch (item) {
                .string => |s| try base.append(gpa, try gpa.dupe(u8, s)),
                else => {},
            };
            cfg.base_args = try base.toOwnedSlice(gpa);
        },
        else => {},
    };

    if (obj.get("requiresInteractive")) |v| switch (v) {
        .bool => |b| { cfg.requires_interactive = b; },
        else => {},
    };

    if (obj.get("interactiveFlags")) |v| switch (v) {
        .array => |arr| {
            var flags_list: std.ArrayList([]const u8) = .empty;
            for (arr.items) |item| switch (item) {
                .string => |s| try flags_list.append(gpa, try gpa.dupe(u8, s)),
                else => {},
            };
            cfg.interactive_flags = try flags_list.toOwnedSlice(gpa);
        },
        else => {},
    };

    return cfg;
}

pub fn validateNonTtySafety(
    io: std.Io,
    gpa: std.mem.Allocator,
    requires_interactive: bool,
    interactive_flags: []const []const u8,
    argv: []const []const u8,
) !void {
    _ = gpa;
    const is_tty = std.Io.File.stdout().isTty(io) catch false;
    if (!is_tty) {
        if (requires_interactive) {
            return error.SafetyViolation;
        }
        for (argv) |arg| {
            for (interactive_flags) |iflag| {
                if (std.mem.eql(u8, arg, iflag)) {
                    return error.SafetyViolation;
                }
                if (std.mem.startsWith(u8, iflag, "-")) {
                    if (std.mem.startsWith(u8, arg, iflag) and arg.len > iflag.len and arg[iflag.len] == '=') {
                        return error.SafetyViolation;
                    }
                }
            }
        }
    }
}

test "validateNonTtySafety basic tests" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var threaded = std.Io.Threaded.init(gpa, .{});
    defer threaded.deinit();
    const io = threaded.io();

    const acfg1 = AdapterConfig{
        .requires_interactive = true,
    };
    const argv1 = &[_][]const u8{"hello"};
    
    const is_tty = std.Io.File.stdout().isTty(io) catch false;
    if (!is_tty) {
        try testing.expectError(error.SafetyViolation, validateNonTtySafety(io, gpa, acfg1.requires_interactive, acfg1.interactive_flags, argv1));
    } else {
        try validateNonTtySafety(io, gpa, acfg1.requires_interactive, acfg1.interactive_flags, argv1);
    }

    const acfg2 = AdapterConfig{
        .requires_interactive = false,
        .interactive_flags = @constCast(&[_][]const u8{ "--interactive", "-i" }),
    };

    if (!is_tty) {
        const argv_unsafe1 = &[_][]const u8{ "--interactive" };
        try testing.expectError(error.SafetyViolation, validateNonTtySafety(io, gpa, acfg2.requires_interactive, acfg2.interactive_flags, argv_unsafe1));

        const argv_unsafe2 = &[_][]const u8{ "-i" };
        try testing.expectError(error.SafetyViolation, validateNonTtySafety(io, gpa, acfg2.requires_interactive, acfg2.interactive_flags, argv_unsafe2));

        const argv_unsafe3 = &[_][]const u8{ "--interactive=true" };
        try testing.expectError(error.SafetyViolation, validateNonTtySafety(io, gpa, acfg2.requires_interactive, acfg2.interactive_flags, argv_unsafe3));

        const argv_safe = &[_][]const u8{ "--some-other-flag" };
        try validateNonTtySafety(io, gpa, acfg2.requires_interactive, acfg2.interactive_flags, argv_safe);
    }
}
