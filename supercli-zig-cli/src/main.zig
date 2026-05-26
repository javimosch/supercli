// main.zig — SuperCLI Zig CLI entry point.
// Clean-room implementation of core sc commands in Zig 0.16.0.
// Compatible with ~/.supercli/plugins/plugins.lock.json.
const std = @import("std");
const output = @import("output.zig");
const config = @import("config.zig");
const registry = @import("registry.zig");
const executor = @import("executor.zig");
const update = @import("update.zig");

const VERSION = "0.1.0";
const RESERVED_FLAGS = [_][]const u8{ "json", "human", "compact", "schema", "help", "no-color", "format" };

// Parsed command-line state
const Args = struct {
    positional: [][]const u8,
    flags: std.StringHashMap([]const u8),
    mode: output.Mode,
    raw_args: [][]const u8, // everything after binary name
    allocator: std.mem.Allocator,

    pub fn deinit(self: *Args) void {
        self.allocator.free(self.positional);
        self.allocator.free(self.raw_args);
        var self_flags = self.flags;
        self_flags.deinit();
    }
};

// Flags that are boolean (no value follows): if you add a --key value flag you want
// to treat as key=value, do NOT put it here.
const BOOL_FLAGS = [_][]const u8{ "json", "human", "compact", "replace", "check", "force", "installed" };

fn isBoolFlag(name: []const u8, custom_bool_flags: ?std.StringHashMap(void)) bool {
    if (custom_bool_flags) |cbf| {
        if (cbf.contains(name)) return true;
    }
    for (BOOL_FLAGS) |f| {
        if (std.mem.eql(u8, name, f)) return true;
    }
    return false;
}

fn parseArgs(gpa: std.mem.Allocator, io: std.Io, args_iter: []const []const u8, custom_bool_flags: ?std.StringHashMap(void)) !Args {
    var positional: std.ArrayList([]const u8) = .empty;
    var flags = std.StringHashMap([]const u8).init(gpa);
    var raw_args: std.ArrayList([]const u8) = .empty;
    var mode = output.Mode.human; // default: human if TTY
    var has_json = false;
    var has_human = false;

    // Detect if stdout is a TTY
    const is_tty = std.Io.File.stdout().isTty(io) catch false;

    var i: usize = 0;
    while (i < args_iter.len) : (i += 1) {
        const arg = args_iter[i];
        try raw_args.append(gpa, arg);

        if (std.mem.startsWith(u8, arg, "--")) {
            const kv = arg[2..];
            if (std.mem.indexOf(u8, kv, "=")) |eq| {
                // --key=value form
                const k = kv[0..eq];
                const v = kv[eq + 1 ..];
                try flags.put(k, v);
                if (std.mem.eql(u8, k, "json")) has_json = true;
                if (std.mem.eql(u8, k, "human")) has_human = true;
            } else if (!isBoolFlag(kv, custom_bool_flags) and i + 1 < args_iter.len and !std.mem.startsWith(u8, args_iter[i + 1], "--")) {
                // --key value form (value is next non-flag arg)
                i += 1;
                const v = args_iter[i];
                try raw_args.append(gpa, v);
                try flags.put(kv, v);
                if (std.mem.eql(u8, kv, "json")) has_json = true;
                if (std.mem.eql(u8, kv, "human")) has_human = true;
            } else {
                // Boolean flag: --key
                try flags.put(kv, "true");
                if (std.mem.eql(u8, kv, "json")) has_json = true;
                if (std.mem.eql(u8, kv, "human")) has_human = true;
            }
        } else {
            try positional.append(gpa, arg);
        }
    }

    // Determine output mode
    if (has_human) {
        mode = .human;
    } else if (has_json) {
        mode = .json;
    } else if (is_tty) {
        mode = .human;
    } else {
        mode = .json;
    }

    return Args{
        .positional = try positional.toOwnedSlice(gpa),
        .flags = flags,
        .mode = mode,
        .raw_args = try raw_args.toOwnedSlice(gpa),
        .allocator = gpa,
    };
}

// Get the bundled plugins catalog directory: ~/.supercli/plugins/bundled
// Falls back to adjacent plugins/ dir for development builds.
fn bundledPluginsDir(gpa: std.mem.Allocator, io: std.Io, home: []const u8) ![]const u8 {
    // Primary: ~/.supercli/plugins/bundled/
    const bundled = try std.fmt.allocPrint(gpa, "{s}/.supercli/plugins/bundled", .{home});
    if (std.Io.Dir.cwd().openDir(io, bundled, .{})) |d| {
        var dd = d;
        dd.close(io);
        return bundled;
    } else |_| {}

    // Fallback for dev: adjacent plugins/ dir
    const exe_path = try std.process.executablePathAlloc(io, gpa);
    defer gpa.free(exe_path);
    const exe_dir = std.fs.path.dirname(exe_path) orelse ".";
    const candidates = [_][]const u8{
        try std.fmt.allocPrint(gpa, "{s}/../plugins", .{exe_dir}),
        try std.fmt.allocPrint(gpa, "{s}/../../plugins", .{exe_dir}),
        try std.fmt.allocPrint(gpa, "{s}/../../../plugins", .{exe_dir}),
    };
    for (candidates) |c| {
        if (std.Io.Dir.cwd().openDir(io, c, .{})) |d| {
            var dd = d;
            dd.close(io);
            return c;
        } else |_| {}
    }
    return try gpa.dupe(u8, "plugins");
}

// ----- Command handlers -----

fn handleBootstrap(gpa: std.mem.Allocator, mode: output.Mode) void {
    if (mode == .human) {
        output.writeLine("\n  SuperCLI (Zig) v0.1.0\n");
        output.writeLine("  Fast single-binary implementation of the SuperCLI core.");
        output.writeLine("  Reads ~/.supercli/plugins/plugins.lock.json\n");
        output.writeLine("  Usage: sc-zig <namespace> <resource> <action> [--flags]");
        output.writeLine("  Flags:  --json | --human");
        output.writeLine("  Cmds:   commands | inspect | plugins list|explore|install|update\n");
        output.writeLine("  Quick start:");
        output.writeLine("    sc-zig plugins explore --name memory --json   # find memory plugins");
        output.writeLine("    sc-zig plugins install agentmemory-cli        # install via Node.js sc");
        output.writeLine("    sc-zig commands --query memory --json         # list commands");
        output.writeLine("    sc-zig inspect <ns> <res> <act> --json        # inspect a command\n");
        return;
    }
    var out: std.Io.Writer.Allocating = .init(gpa);
    defer out.deinit();
    var jw: std.json.Stringify = .{ .writer = &out.writer };
    jw.beginObject() catch return;
    jw.objectField("version") catch return;
    jw.write("1.0") catch return;
    jw.objectField("mode") catch return;
    jw.write("agent_bootstrap") catch return;
    jw.objectField("name") catch return;
    jw.write("supercli-zig") catch return;
    jw.objectField("zig_version") catch return;
    jw.write(VERSION) catch return;
    jw.objectField("what_is_this") catch return;
    jw.write("Fast single-binary SuperCLI. Reads ~/.supercli/plugins/plugins.lock.json. Plugin install delegates to Node.js sc.") catch return;
    jw.objectField("workflow") catch return;
    jw.write("discover -> inspect -> execute") catch return;
    jw.objectField("first_steps") catch return;
    jw.beginArray() catch return;
    jw.write("sc-zig plugins explore --name <topic> --json  # find plugins by keyword") catch return;
    jw.write("sc-zig plugins install <name>                 # install plugin (needs Node.js sc)") catch return;
    jw.write("sc-zig commands --query <keyword> --json      # list matching commands") catch return;
    jw.write("sc-zig inspect <ns> <res> <act> --json        # inspect command schema") catch return;
    jw.write("sc-zig <ns> <res> <act> --flag val --json     # execute command") catch return;
    jw.endArray() catch return;
    jw.objectField("memory_workflow") catch return;
    jw.beginObject() catch return;
    jw.objectField("step1") catch return;
    jw.write("sc-zig plugins explore --name memory --json") catch return;
    jw.objectField("step2") catch return;
    jw.write("sc-zig plugins install agentmemory-cli") catch return;
    jw.objectField("step3") catch return;
    jw.write("sc-zig agentmemory-cli memory save --text \"my name is Javi\" --project default --json") catch return;
    jw.objectField("step4") catch return;
    jw.write("sc-zig agentmemory-cli memory search --query Javi --json") catch return;
    jw.endObject() catch return;
    jw.objectField("feature_notes") catch return;
    jw.beginArray() catch return;
    jw.write("plugins explore: searches ~/.supercli/plugins/bundled/ catalog (~3000 plugins)") catch return;
    jw.write("plugins install: delegates to 'sc plugins install' (Node.js sc required)") catch return;
    jw.write("plugins list: shows installed plugins from plugins.lock.json") catch return;
    jw.write("positional args: schema-defined positional args are passed correctly") catch return;
    jw.write("--key value: flags passed as separate args for broadest binary compat") catch return;
    jw.endArray() catch return;
    jw.endObject() catch return;
    output.writeRaw(out.written());
    output.writeRaw("\n");
}

fn handleCommands(
    gpa: std.mem.Allocator,
    lock: *const config.Lock,
    mode: output.Mode,
    flags: std.StringHashMap([]const u8),
) !void {
    const cmds = try config.allCommands(lock, gpa);
    defer gpa.free(cmds);

    const query = flags.get("query") orelse flags.get("q") orelse "";
    const query_lower = try std.ascii.allocLowerString(gpa, query);
    defer gpa.free(query_lower);

    const limit_str = flags.get("limit") orelse flags.get("l") orelse "";
    const limit: usize = if (limit_str.len > 0) std.fmt.parseInt(usize, limit_str, 10) catch 0 else 0;

    var filtered: std.ArrayList(config.Command) = .empty;

    for (cmds) |cmd| {
        if (query_lower.len > 0) {
            const haystack_raw = try std.fmt.allocPrint(gpa, "{s} {s} {s} {s} {s}", .{
                cmd.namespace, cmd.resource, cmd.action, cmd.description, cmd.adapter,
            });
            defer gpa.free(haystack_raw);
            const haystack = try std.ascii.allocLowerString(gpa, haystack_raw);
            defer gpa.free(haystack);
            if (std.mem.indexOf(u8, haystack, query_lower) == null) continue;
        }
        try filtered.append(gpa, cmd);
    }

    const total = filtered.items.len;
    const returned_count = if (limit > 0) @min(limit, total) else total;

    if (mode == .human) {
        output.writeLine("\n  Commands\n");
        for (filtered.items[0..returned_count]) |cmd| {
            var buf: [512]u8 = undefined;
            const line = std.fmt.bufPrint(&buf, "  {s} {s} {s}  [{s}]  {s}\n", .{
                cmd.namespace, cmd.resource, cmd.action, cmd.adapter, cmd.description,
            }) catch continue;
            output.writeRaw(line);
        }
        var buf2: [64]u8 = undefined;
        const summary = std.fmt.bufPrint(&buf2, "  Returned: {d}/{d}\n\n", .{ returned_count, total }) catch "";
        output.writeRaw(summary);
        return;
    }

    var out: std.Io.Writer.Allocating = .init(gpa);
    defer out.deinit();
    var jw: std.json.Stringify = .{ .writer = &out.writer };
    jw.beginObject() catch return;
    jw.objectField("version") catch return;
    jw.write("1.0") catch return;
    jw.objectField("total") catch return;
    jw.write(total) catch return;
    jw.objectField("returned") catch return;
    jw.write(returned_count) catch return;
    jw.objectField("commands") catch return;
    jw.beginArray() catch return;
    for (filtered.items[0..returned_count]) |cmd| {
        jw.beginObject() catch return;
        jw.objectField("command") catch return;
        const cmd_str = try std.fmt.allocPrint(gpa, "{s} {s} {s}", .{ cmd.namespace, cmd.resource, cmd.action });
        defer gpa.free(cmd_str);
        jw.write(cmd_str) catch return;
        jw.objectField("namespace") catch return;
        jw.write(cmd.namespace) catch return;
        jw.objectField("resource") catch return;
        jw.write(cmd.resource) catch return;
        jw.objectField("action") catch return;
        jw.write(cmd.action) catch return;
        jw.objectField("description") catch return;
        jw.write(cmd.description) catch return;
        jw.objectField("adapter") catch return;
        jw.write(cmd.adapter) catch return;
        jw.endObject() catch return;
    }
    jw.endArray() catch return;
    jw.endObject() catch return;
    output.writeRaw(out.written());
    output.writeRaw("\n");
}

fn handleInspect(
    gpa: std.mem.Allocator,
    lock: *const config.Lock,
    mode: output.Mode,
    ns: []const u8,
    res: []const u8,
    act: []const u8,
) void {
    const cmd = config.findCommand(lock, ns, res, act) orelse {
        output.exitWithError(gpa, mode, .{
            .code = 92,
            .err_type = "resource_not_found",
            .message = "Command not found",
            .recoverable = false,
            .suggestions = &.{"Run: sc-zig commands --json"},
        });
    };

    if (mode == .human) {
        var buf: [512]u8 = undefined;
        const header = std.fmt.bufPrint(&buf, "\n  {s}.{s}.{s}\n\n", .{ cmd.namespace, cmd.resource, cmd.action }) catch "";
        output.writeRaw(header);
        output.writeRaw("  Description: ");
        output.writeLine(cmd.description);
        output.writeRaw("  Adapter:     ");
        output.writeLine(cmd.adapter);
        output.writeLine("");
        return;
    }

    var out: std.Io.Writer.Allocating = .init(gpa);
    defer out.deinit();
    var jw: std.json.Stringify = .{ .writer = &out.writer };
    jw.beginObject() catch return;
    jw.objectField("version") catch return;
    jw.write("1.0") catch return;
    jw.objectField("command") catch return;
    const cmd_str = std.fmt.allocPrint(gpa, "{s}.{s}.{s}", .{ cmd.namespace, cmd.resource, cmd.action }) catch "";
    defer gpa.free(cmd_str);
    jw.write(cmd_str) catch return;
    jw.objectField("description") catch return;
    jw.write(cmd.description) catch return;
    jw.objectField("adapter") catch return;
    jw.write(cmd.adapter) catch return;
    jw.objectField("adapterConfig") catch return;
    if (cmd.adapter_config_raw) |acr| jw.write(acr) catch return else jw.write(null) catch return;
    jw.objectField("args") catch return;
    if (cmd.args_raw) |ar| jw.write(ar) catch return else jw.beginArray() catch return;
    if (cmd.args_raw == null) jw.endArray() catch return;
    jw.endObject() catch return;
    output.writeRaw(out.written());
    output.writeRaw("\n");
}

fn handlePluginsList(gpa: std.mem.Allocator, lock: *const config.Lock, mode: output.Mode) void {
    if (mode == .human) {
        output.writeLine("\n  Installed Plugins\n");
        for (lock.plugins) |p| {
            var buf: [256]u8 = undefined;
            const line = std.fmt.bufPrint(&buf, "  {s}  v{s}  {s}\n", .{ p.name, p.version, p.description }) catch continue;
            output.writeRaw(line);
        }
        output.writeLine("");
        return;
    }

    var out: std.Io.Writer.Allocating = .init(gpa);
    defer out.deinit();
    var jw: std.json.Stringify = .{ .writer = &out.writer };
    jw.beginObject() catch return;
    jw.objectField("version") catch return;
    jw.write("1.0") catch return;
    jw.objectField("total") catch return;
    jw.write(lock.plugins.len) catch return;
    jw.objectField("plugins") catch return;
    jw.beginArray() catch return;
    for (lock.plugins) |p| {
        jw.beginObject() catch return;
        jw.objectField("name") catch return;
        jw.write(p.name) catch return;
        jw.objectField("version") catch return;
        jw.write(p.version) catch return;
        jw.objectField("description") catch return;
        jw.write(p.description) catch return;
        jw.objectField("commands") catch return;
        jw.write(p.commands.len) catch return;
        jw.endObject() catch return;
    }
    jw.endArray() catch return;
    jw.endObject() catch return;
    output.writeRaw(out.written());
    output.writeRaw("\n");
}

fn handlePluginsUpdate(
    io: std.Io,
    gpa: std.mem.Allocator,
    mode: output.Mode,
    flags: std.StringHashMap([]const u8),
    home: []const u8,
) !void {
    const start = std.Io.Timestamp.now(io, .real).toMilliseconds();
    const check_only = flags.contains("check");
    const force = flags.contains("force");

    const result = update.updatePlugins(io, gpa, .{
        .check_only = check_only,
        .force = force,
        .home = home,
    }) catch |err| {
        const msg = switch (err) {
            error.CurlFailed => "Failed to fetch remote catalog. Is curl installed and internet available?",
            error.TarFailed => "Failed to extract plugin archive. Is tar installed?",
            else => "Plugin update failed",
        };
        output.exitWithError(gpa, mode, .{
            .code = 105,
            .err_type = "integration_error",
            .message = msg,
            .recoverable = true,
            .suggestions = &.{"Check internet connection and retry"},
        });
    };

    const duration = std.Io.Timestamp.now(io, .real).toMilliseconds() - start;

    if (mode == .human) {
        if (result.up_to_date) {
            output.writeLine("  Plugins are up to date");
            return;
        }
        var buf: [128]u8 = undefined;
        const s = std.fmt.bufPrint(&buf, "  Updated {d} plugins (+{d} new, ~{d} changed) in {d}ms\n", .{
            result.updated.len, result.added, result.changed, duration,
        }) catch "";
        output.writeRaw(s);
        return;
    }

    var out: std.Io.Writer.Allocating = .init(gpa);
    defer out.deinit();
    var jw: std.json.Stringify = .{ .writer = &out.writer };
    jw.beginObject() catch return;
    jw.objectField("version") catch return;
    jw.write("1.0") catch return;
    jw.objectField("remote_count") catch return;
    jw.write(result.remote_count) catch return;
    jw.objectField("added") catch return;
    jw.write(result.added) catch return;
    jw.objectField("changed") catch return;
    jw.write(result.changed) catch return;
    jw.objectField("unchanged") catch return;
    jw.write(result.unchanged) catch return;
    jw.objectField("updated") catch return;
    jw.write(result.updated.len) catch return;
    jw.objectField("check_only") catch return;
    jw.write(result.check_only) catch return;
    jw.objectField("up_to_date") catch return;
    jw.write(result.up_to_date) catch return;
    jw.objectField("duration_ms") catch return;
    jw.write(duration) catch return;
    jw.endObject() catch return;
    output.writeRaw(out.written());
    output.writeRaw("\n");
}

fn handleExecuteCommand(
    io: std.Io,
    gpa: std.mem.Allocator,
    mode: output.Mode,
    cmd: config.Command,
    flags: std.StringHashMap([]const u8),
    passthrough_args: [][]const u8,
    is_passthrough: bool,
) !void {
    const start = std.Io.Timestamp.now(io, .real).toMilliseconds();

    if (!std.mem.eql(u8, cmd.adapter, "process")) {
        output.exitWithError(gpa, mode, .{
            .code = 85,
            .err_type = "invalid_argument",
            .message = "Only 'process' adapter is supported in the Zig CLI",
            .recoverable = false,
        });
    }

    const acfg = try executor.parseAdapterConfig(gpa, cmd.adapter_config_raw);

    if (acfg.command.len == 0) {
        output.exitWithError(gpa, mode, .{
            .code = 85,
            .err_type = "invalid_argument",
            .message = "Command has no binary configured (missing adapterConfig.command)",
            .recoverable = false,
        });
    }

    // Parse arg definitions from plugin schema (to detect positional args)
    const arg_defs = try executor.parseArgDefs(gpa, cmd.args_raw);

    // Build extra args from user flags (skip reserved + supercli-specific)
    var skip_keys: std.ArrayList([]const u8) = .empty;
    for (RESERVED_FLAGS) |k| try skip_keys.append(gpa, k);
    try skip_keys.append(gpa, "limit");
    try skip_keys.append(gpa, "query");

    const extra_args = if (is_passthrough or acfg.passthrough)
        passthrough_args
    else
        try executor.buildFlagArgs(gpa, flags, skip_keys.items, arg_defs);

    const exec_result = executor.executeProcess(io, gpa, acfg.command, .{
        .base_args = acfg.base_args,
        .extra_args = extra_args,
        .passthrough = is_passthrough or acfg.passthrough,
        .parse_json = acfg.parse_json,
        .timeout_ms = acfg.timeout_ms,
        .cwd = acfg.cwd,
        .requires_interactive = acfg.requires_interactive,
        .interactive_flags = acfg.interactive_flags,
    }) catch |err| {
        if (err == error.SafetyViolation) {
            output.exitWithError(gpa, mode, .{
                .code = 91,
                .err_type = "safety_violation",
                .message = "Interactive command blocked in non-TTY context",
                .recoverable = false,
            });
        }
        return err;
    };

    const duration = std.Io.Timestamp.now(io, .real).toMilliseconds() - start;

    switch (exec_result) {
        .passthrough => return, // stdio was inherited, nothing to emit
        .err => |e| {
            output.exitWithError(gpa, mode, .{
                .code = e.exit_code,
                .err_type = if (e.exit_code == 124) "timeout_error" else "integration_error",
                .message = e.message,
                .recoverable = true,
            });
        },
        .json => |json_val| {
            if (mode == .human) {
                var out: std.Io.Writer.Allocating = .init(gpa);
                defer out.deinit();
                var jw: std.json.Stringify = .{
                    .writer = &out.writer,
                    .options = .{ .whitespace = .indent_2 },
                };
                jw.write(json_val) catch {};
                output.writeRaw(out.written());
                output.writeRaw("\n");
            } else {
                var out: std.Io.Writer.Allocating = .init(gpa);
                defer out.deinit();
                var jw: std.json.Stringify = .{ .writer = &out.writer };
                jw.beginObject() catch return;
                jw.objectField("version") catch return;
                jw.write("1.0") catch return;
                const cmd_key = try std.fmt.allocPrint(gpa, "{s}.{s}.{s}", .{ cmd.namespace, cmd.resource, cmd.action });
                defer gpa.free(cmd_key);
                jw.objectField("command") catch return;
                jw.write(cmd_key) catch return;
                jw.objectField("duration_ms") catch return;
                jw.write(duration) catch return;
                jw.objectField("data") catch return;
                jw.write(json_val) catch return;
                jw.endObject() catch return;
                output.writeRaw(out.written());
                output.writeRaw("\n");
            }
        },
        .raw => |raw_val| {
            if (mode == .human) {
                output.writeLine(raw_val);
            } else {
                var out: std.Io.Writer.Allocating = .init(gpa);
                defer out.deinit();
                var jw: std.json.Stringify = .{ .writer = &out.writer };
                jw.beginObject() catch return;
                jw.objectField("version") catch return;
                jw.write("1.0") catch return;
                const cmd_key = try std.fmt.allocPrint(gpa, "{s}.{s}.{s}", .{ cmd.namespace, cmd.resource, cmd.action });
                defer gpa.free(cmd_key);
                jw.objectField("command") catch return;
                jw.write(cmd_key) catch return;
                jw.objectField("duration_ms") catch return;
                jw.write(duration) catch return;
                jw.objectField("data") catch return;
                jw.beginObject() catch return;
                jw.objectField("raw") catch return;
                jw.write(raw_val) catch return;
                jw.endObject() catch return;
                jw.endObject() catch return;
                output.writeRaw(out.written());
                output.writeRaw("\n");
            }
        },
    }
}

fn handleVersionInfo(gpa: std.mem.Allocator, mode: output.Mode) void {
    if (mode == .human) {
        output.writeLine("SuperCLI (Zig) v0.1.0");
        output.writeLine("Implementation: Zig 0.16.0");
        output.writeLine("Binary: sc-zig");
        return;
    }
    var out: std.Io.Writer.Allocating = .init(gpa);
    defer out.deinit();
    var jw: std.json.Stringify = .{ .writer = &out.writer };
    jw.beginObject() catch return;
    jw.objectField("name") catch return;
    jw.write("SuperCLI") catch return;
    jw.objectField("implementation") catch return;
    jw.write("Zig") catch return;
    jw.objectField("version") catch return;
    jw.write("0.1.0") catch return;
    jw.objectField("zig_version") catch return;
    jw.write("0.16.0") catch return;
    jw.objectField("binary_name") catch return;
    jw.write("sc-zig") catch return;
    jw.endObject() catch return;
    output.writeRaw(out.written());
    output.writeRaw("\n");
}

fn handleInstallAsSc(io: std.Io, gpa: std.mem.Allocator, mode: output.Mode) void {
    // Get current executable path
    const current_exe = std.process.executablePathAlloc(io, gpa) catch {
        output.exitWithError(gpa, mode, .{
            .code = 101,
            .err_type = "internal_error",
            .message = "Failed to get executable path",
            .recoverable = false,
        });
    };
    defer gpa.free(current_exe);

    if (mode == .human) {
        output.writeLine("  Installing sc-zig as sc...\n");
        output.writeRaw("  Current binary: ");
        output.writeLine(current_exe);
        output.writeLine("  This will replace the Node.js 'sc' command with the Zig version.");
        output.writeLine("  To revert, run: npm uninstall -g supercli && npm install -g supercli\n");
    } else {
        var out: std.Io.Writer.Allocating = .init(gpa);
        defer out.deinit();
        var jw: std.json.Stringify = .{ .writer = &out.writer };
        jw.beginObject() catch return;
        jw.objectField("action") catch return;
        jw.write("install_as_sc") catch return;
        jw.objectField("current_binary") catch return;
        jw.write(current_exe) catch return;
        jw.objectField("note") catch return;
        jw.write("This replaces Node.js sc with Zig sc-zig. Revert: npm uninstall -g supercli && npm install -g supercli") catch return;
        jw.endObject() catch return;
        output.writeRaw(out.written());
        output.writeRaw("\n");
    }

    // Create symlink: /usr/local/bin/sc -> current_exe
    // For now, just print instructions (actual install done by curl script)
    if (mode == .human) {
        output.writeLine("  Installation instructions:");
        output.writeLine("    sudo ln -sf ");
        output.writeRaw(current_exe);
        output.writeLine(" /usr/local/bin/sc");
        output.writeLine("");
        output.writeLine("  Or use the curl install script with --replace flag:");
        output.writeLine("    curl -sSL https://github.com/javimosch/supercli/releases/download/v0.1.0-zig/install.sh | bash -s -- --replace");
    }
}

// ----- Main -----

pub fn main(init: std.process.Init) !void {
    const gpa = init.gpa;
    const io = init.io;

    // Early check for --version / --info flags
    var args_list: std.ArrayList([]const u8) = .empty;
    var args_it = std.process.Args.Iterator.init(init.minimal.args);
    _ = args_it.next(); // skip binary name
    var has_version_flag = false;
    var has_json_flag = false;
    while (args_it.next()) |arg| {
        try args_list.append(gpa, arg);
        if (std.mem.eql(u8, arg, "--version") or std.mem.eql(u8, arg, "--info")) {
            has_version_flag = true;
        }
        if (std.mem.eql(u8, arg, "--json")) {
            has_json_flag = true;
        }
    }
    const raw_argv = try args_list.toOwnedSlice(gpa);

    if (has_version_flag) {
        const mode = if (has_json_flag) output.Mode.json else output.Mode.human;
        handleVersionInfo(gpa, mode);
        return;
    }

    var parsed = try parseArgs(gpa, io, raw_argv, null);
    defer parsed.deinit();
    const mode = parsed.mode;
    const pos = parsed.positional;

    const home = init.environ_map.get("HOME") orelse init.environ_map.get("USERPROFILE") orelse "/tmp";

    // Top-level: no args
    if (pos.len == 0) {
        handleBootstrap(gpa, mode);
        return;
    }

    // ----- `help` -----
    if (std.mem.eql(u8, pos[0], "help")) {
        handleBootstrap(gpa, mode);
        return;
    }

    // ----- `install-as-sc` -----
    if (std.mem.eql(u8, pos[0], "install-as-sc")) {
        handleInstallAsSc(io, gpa, mode);
        return;
    }

    // ----- `commands` -----
    if (std.mem.eql(u8, pos[0], "commands")) {
        var lock = try config.readLock(io, home, gpa);
        defer lock.deinit();
        try handleCommands(gpa, &lock, mode, parsed.flags);
        return;
    }

    // ----- `inspect <ns> <res> <act>` -----
    if (std.mem.eql(u8, pos[0], "inspect")) {
        if (pos.len < 4) {
            output.exitWithError(gpa, mode, .{
                .code = 85,
                .err_type = "invalid_argument",
                .message = "Usage: sc-zig inspect <namespace> <resource> <action>",
                .recoverable = false,
            });
        }
        var lock = try config.readLock(io, home, gpa);
        defer lock.deinit();
        handleInspect(gpa, &lock, mode, pos[1], pos[2], pos[3]);
        return;
    }

    // ----- `plugins` -----
    if (std.mem.eql(u8, pos[0], "plugins")) {
        const sub = if (pos.len > 1) pos[1] else "";

        if (std.mem.eql(u8, sub, "list") or std.mem.eql(u8, sub, "ls")) {
            var lock = try config.readLock(io, home, gpa);
            defer lock.deinit();
            handlePluginsList(gpa, &lock, mode);
            return;
        }

        if (std.mem.eql(u8, sub, "update")) {
            try handlePluginsUpdate(io, gpa, mode, parsed.flags, home);
            return;
        }

        if (std.mem.eql(u8, sub, "explore")) {
            const plugins_path = try bundledPluginsDir(gpa, io, home);
            const all_plugins = try registry.discoverPluginsInDir(io, gpa, plugins_path);

            const name_query = parsed.flags.get("name") orelse "";
            const tags_query = parsed.flags.get("tags") orelse "";
            const installed_only = parsed.flags.contains("installed");

            // Load installed plugin names from lock for installed/not-installed annotation
            var lock = try config.readLock(io, home, gpa);
            defer lock.deinit();
            var installed_set = std.StringHashMap(bool).init(gpa);
            defer installed_set.deinit();
            for (lock.plugins) |p| {
                try installed_set.put(p.name, true);
            }

            var filtered: []registry.RegistryPlugin = all_plugins;
            if (name_query.len > 0) {
                filtered = try registry.filterByName(filtered, name_query, gpa);
            }
            if (tags_query.len > 0) {
                // Support comma-separated tags
                var tag_iter = std.mem.splitScalar(u8, tags_query, ',');
                while (tag_iter.next()) |tag| {
                    const t = std.mem.trim(u8, tag, " ");
                    if (t.len > 0) {
                        filtered = try registry.filterByTag(filtered, t, gpa);
                    }
                }
            }
            if (installed_only) {
                var inst_list: std.ArrayList(registry.RegistryPlugin) = .empty;
                for (filtered) |p| {
                    if (installed_set.contains(p.name)) try inst_list.append(gpa, p);
                }
                filtered = try inst_list.toOwnedSlice(gpa);
            }

            // If no plugins found, suggest running plugins update
            if (filtered.len == 0) {
                if (mode == .human) {
                    output.writeLine("\n  No plugins found matching your criteria.");
                    output.writeLine("  Try running: sc-zig plugins update");
                    output.writeLine("  This will download the latest plugin catalog from GitHub.\n");
                    return;
                } else {
                    var out: std.Io.Writer.Allocating = .init(gpa);
                    defer out.deinit();
                    var jw: std.json.Stringify = .{ .writer = &out.writer };
                    jw.beginObject() catch return;
                    jw.objectField("version") catch return;
                    jw.write("1.0") catch return;
                    jw.objectField("total") catch return;
                    jw.write(0) catch return;
                    jw.objectField("returned") catch return;
                    jw.write(0) catch return;
                    jw.objectField("plugins") catch return;
                    jw.beginArray() catch return;
                    jw.endArray() catch return;
                    jw.objectField("filters") catch return;
                    jw.beginObject() catch return;
                    jw.objectField("name") catch return;
                    jw.write(name_query) catch return;
                    jw.objectField("tags") catch return;
                    jw.write(tags_query) catch return;
                    jw.endObject() catch return;
                    jw.objectField("suggestion") catch return;
                    jw.write("Run: sc-zig plugins update") catch return;
                    jw.endObject() catch return;
                    output.writeRaw(out.written());
                    output.writeRaw("\n");
                    return;
                }
            }

            const limit_str = parsed.flags.get("limit") orelse "";
            const limit: usize = if (limit_str.len > 0) std.fmt.parseInt(usize, limit_str, 10) catch 0 else 0;
            const returned_count = if (limit > 0) @min(limit, filtered.len) else filtered.len;

            if (mode == .human) {
                output.writeLine("\n  Plugins\n");
                for (filtered[0..returned_count]) |p| {
                    const inst_str = if (installed_set.contains(p.name)) "[installed]" else "";
                    var buf: [512]u8 = undefined;
                    const line = std.fmt.bufPrint(&buf, "  {s}  {s}  {s}\n", .{ p.name, inst_str, p.description }) catch continue;
                    output.writeRaw(line);
                }
                var buf2: [64]u8 = undefined;
                const summary = std.fmt.bufPrint(&buf2, "  Returned: {d}/{d}\n\n", .{ returned_count, filtered.len }) catch "";
                output.writeRaw(summary);
                return;
            }

            var out: std.Io.Writer.Allocating = .init(gpa);
            defer out.deinit();
            var jw: std.json.Stringify = .{ .writer = &out.writer };
            jw.beginObject() catch return;
            jw.objectField("version") catch return;
            jw.write("1.0") catch return;
            jw.objectField("total") catch return;
            jw.write(filtered.len) catch return;
            jw.objectField("returned") catch return;
            jw.write(returned_count) catch return;
            jw.objectField("plugins") catch return;
            jw.beginArray() catch return;
            for (filtered[0..returned_count]) |p| {
                jw.beginObject() catch return;
                jw.objectField("name") catch return;
                jw.write(p.name) catch return;
                jw.objectField("description") catch return;
                jw.write(p.description) catch return;
                jw.objectField("has_learn") catch return;
                jw.write(p.has_learn) catch return;
                jw.objectField("installed") catch return;
                jw.write(installed_set.contains(p.name)) catch return;
                jw.endObject() catch return;
            }
            jw.endArray() catch return;
            jw.objectField("filters") catch return;
            jw.beginObject() catch return;
            jw.objectField("name") catch return;
            jw.write(name_query) catch return;
            jw.objectField("tags") catch return;
            jw.write(tags_query) catch return;
            jw.endObject() catch return;
            jw.endObject() catch return;
            output.writeRaw(out.written());
            output.writeRaw("\n");
            return;
        }

        if (std.mem.eql(u8, sub, "install")) {
            const plugin_name = if (pos.len > 2) pos[2] else "";
            if (plugin_name.len == 0) {
                output.exitWithError(gpa, mode, .{
                    .code = 85,
                    .err_type = "invalid_argument",
                    .message = "Usage: sc-zig plugins install <name>",
                    .recoverable = false,
                    .suggestions = &.{"Run: sc-zig plugins explore --name <query> --json"},
                });
            }
            // Delegate to Node.js sc for install (it handles registry/npm)
            const sc_cmd = [_][]const u8{ "sc", "plugins", "install", plugin_name, "--json" };
            const result = std.process.run(gpa, io, .{
                .argv = &sc_cmd,
                .cwd = .inherit,
                .stdout_limit = .unlimited,
                .stderr_limit = .unlimited,
            }) catch {
                output.exitWithError(gpa, mode, .{
                    .code = 105,
                    .err_type = "integration_error",
                    .message = "Failed to run 'sc plugins install'. Is Node.js sc installed?",
                    .recoverable = true,
                    .suggestions = &.{"Install Node.js version: npm install -g superacli"},
                });
            };
            const exit_code: u8 = switch (result.term) {
                .exited => |c| c,
                else => 1,
            };
            if (exit_code != 0) {
                const msg = if (result.stderr.len > 0)
                    try gpa.dupe(u8, std.mem.trim(u8, result.stderr, "\n\r "))
                else
                    try std.fmt.allocPrint(gpa, "Plugin install failed (exit {d})", .{exit_code});
                output.exitWithError(gpa, mode, .{
                    .code = 105,
                    .err_type = "integration_error",
                    .message = msg,
                    .recoverable = true,
                });
            }
            output.writeRaw(result.stdout);
            if (result.stdout.len > 0 and result.stdout[result.stdout.len - 1] != '\n') {
                output.writeRaw("\n");
            }
            return;
        }

        // Unknown plugins subcommand
        output.exitWithError(gpa, mode, .{
            .code = 85,
            .err_type = "invalid_argument",
            .message = "Unknown plugins subcommand. Use: list | explore | install | update",
            .recoverable = false,
        });
    }

    // ----- Namespace dispatch: <ns> [res] [act] [--flags] -----
    // Load installed plugins and try to dispatch
    var lock = try config.readLock(io, home, gpa);
    defer lock.deinit();

    const ns = pos[0];
    const res = if (pos.len > 1) pos[1] else "_";
    const act = if (pos.len > 2) pos[2] else "_";

    // Build passthrough args: everything that came after the namespace
    var passthrough_args: [][]const u8 = if (pos.len > 1) raw_argv[1..] else raw_argv[0..0];
    _ = &passthrough_args;

    // Try exact namespace.resource.action match
    if (config.findCommand(&lock, ns, res, act)) |cmd| {
        const user_passthrough = std.mem.eql(u8, res, "_") and std.mem.eql(u8, act, "_");
        const arg_defs = try executor.parseArgDefs(gpa, cmd.args_raw);
        defer gpa.free(arg_defs);

        var custom_bool_flags = std.StringHashMap(void).init(gpa);
        defer custom_bool_flags.deinit();
        for (arg_defs) |arg| {
            if (arg.is_bool) {
                try custom_bool_flags.put(arg.name, {});
            }
        }

        var cmd_parsed = try parseArgs(gpa, io, raw_argv, custom_bool_flags);
        defer cmd_parsed.deinit();

        const cmd_passthrough_args = if (cmd_parsed.positional.len > 1) raw_argv[1..] else raw_argv[0..0];

        try handleExecuteCommand(io, gpa, mode, cmd, cmd_parsed.flags, cmd_passthrough_args, user_passthrough);
        return;
    }

    // Try passthrough command for this namespace
    if (config.findPassthrough(&lock, ns)) |cmd| {
        try handleExecuteCommand(io, gpa, mode, cmd, parsed.flags, passthrough_args, true);
        return;
    }

    // Check if namespace even exists
    var ns_found = false;
    for (lock.plugins) |p| {
        for (p.commands) |cmd| {
            if (std.mem.eql(u8, cmd.namespace, ns)) {
                ns_found = true;
                break;
            }
        }
        if (ns_found) break;
    }

    if (ns_found) {
        output.exitWithError(gpa, mode, .{
            .code = 92,
            .err_type = "resource_not_found",
            .message = "Command not found in this namespace",
            .recoverable = false,
            .suggestions = &.{"Run: sc-zig commands --json"},
        });
    } else {
        output.exitWithError(gpa, mode, .{
            .code = 92,
            .err_type = "resource_not_found",
            .message = "Namespace not found. Is the plugin installed?",
            .recoverable = false,
            .suggestions = &.{
                "Run: sc-zig plugins list --json",
                "Run: sc plugins install <name>",
            },
        });
    }
}

test "parseArgs basic and custom boolean flag re-parsing" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var threaded = std.Io.Threaded.init(gpa, .{});
    defer threaded.deinit();
    const io = threaded.io();

    // Test 1: Basic parsing with --flag=value and empty value
    {
        const argv = &[_][]const u8{ "namespace", "--flag1=value1", "--flag2=" };
        var parsed = try parseArgs(gpa, io, argv, null);
        defer parsed.deinit();

        try testing.expectEqual(@as(usize, 1), parsed.positional.len);
        try testing.expectEqualStrings("namespace", parsed.positional[0]);
        
        try testing.expectEqualStrings("value1", parsed.flags.get("flag1").?);
        try testing.expectEqualStrings("", parsed.flags.get("flag2").?);
    }

    // Test 2: Custom boolean flag re-parsing (ensuring next argument is not consumed)
    {
        const argv = &[_][]const u8{ "ns", "res", "act", "--custom-bool", "positional_arg" };
        var parsed1 = try parseArgs(gpa, io, argv, null);
        defer parsed1.deinit();

        try testing.expectEqual(@as(usize, 3), parsed1.positional.len);
        try testing.expectEqualStrings("ns", parsed1.positional[0]);
        try testing.expectEqualStrings("res", parsed1.positional[1]);
        try testing.expectEqualStrings("act", parsed1.positional[2]);
        try testing.expectEqualStrings("positional_arg", parsed1.flags.get("custom-bool").?);

        var custom_bool_flags = std.StringHashMap(void).init(gpa);
        defer custom_bool_flags.deinit();
        try custom_bool_flags.put("custom-bool", {});

        var parsed2 = try parseArgs(gpa, io, argv, custom_bool_flags);
        defer parsed2.deinit();

        try testing.expectEqual(@as(usize, 4), parsed2.positional.len);
        try testing.expectEqualStrings("ns", parsed2.positional[0]);
        try testing.expectEqualStrings("res", parsed2.positional[1]);
        try testing.expectEqualStrings("act", parsed2.positional[2]);
        try testing.expectEqualStrings("positional_arg", parsed2.positional[3]);
        try testing.expectEqualStrings("true", parsed2.flags.get("custom-bool").?);
    }
}
