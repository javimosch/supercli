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
};

// Build CLI flag args from a parsed flags map (key -> value)
// Mirrors toCliFlags() in process.js
pub fn buildFlagArgs(
    gpa: std.mem.Allocator,
    flags: std.StringHashMap([]const u8),
    skip_keys: []const []const u8,
) ![][]const u8 {
    var list: std.ArrayList([]const u8) = .empty;
    var iter = flags.iterator();
    while (iter.next()) |entry| {
        const k = entry.key_ptr.*;
        // Skip reserved flags
        var skip = false;
        for (skip_keys) |sk| {
            if (std.mem.eql(u8, k, sk)) { skip = true; break; }
        }
        if (skip) continue;
        const v = entry.value_ptr.*;
        if (v.len == 0) continue;
        if (std.mem.eql(u8, v, "true")) {
            try list.append(gpa, try std.fmt.allocPrint(gpa, "--{s}", .{k}));
        } else if (!std.mem.eql(u8, v, "false")) {
            try list.append(gpa, try std.fmt.allocPrint(gpa, "--{s}={s}", .{ k, v }));
        }
    }
    return list.toOwnedSlice(gpa);
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

    if (opts.passthrough) {
        var child = try std.process.spawn(io, .{
            .argv = argv_slice,
            .stdin = .inherit,
            .stdout = .inherit,
            .stderr = .inherit,
            .cwd = if (opts.cwd) |c| .{ .path = c } else .inherit,
        });
        _ = try child.wait(io);
        return ExecResult{ .passthrough = {} };
    }

    // Capture mode
    const result = try std.process.run(gpa, io, .{
        .argv = argv_slice,
        .cwd = if (opts.cwd) |c| .{ .path = c } else .inherit,
        .stdout_limit = .unlimited,
        .stderr_limit = .unlimited,
    });

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

// Extract adapterConfig fields needed for execution
pub const AdapterConfig = struct {
    command: []const u8 = "",
    base_args: [][]const u8 = &.{},
    passthrough: bool = false,
    parse_json: bool = true,
    timeout_ms: u64 = 15000,
    cwd: ?[]const u8 = null,
    missing_dep_help: []const u8 = "",
};

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

    return cfg;
}
