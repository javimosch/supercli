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
};

fn parseArgs(gpa: std.mem.Allocator, io: std.Io, args_iter: []const []const u8) !Args {
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
                const k = kv[0..eq];
                const v = kv[eq + 1 ..];
                try flags.put(k, v);
                if (std.mem.eql(u8, k, "json")) has_json = true;
                if (std.mem.eql(u8, k, "human")) has_human = true;
            } else {
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
    };
}

// Get the plugins directory relative to the executable
fn pluginsDir(gpa: std.mem.Allocator, io: std.Io) ![]const u8 {
    const exe_path = try std.process.executablePathAlloc(io, gpa);
    defer gpa.free(exe_path);
    const exe_dir = std.fs.path.dirname(exe_path) orelse ".";
    // Binary is in supercli-zig-cli/ or supercli-zig-cli/zig-out/bin/
    // Try: exe_dir/../plugins, exe_dir/../../plugins
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
    // Fallback: relative to cwd
    return try gpa.dupe(u8, "plugins");
}

// ----- Command handlers -----

fn handleBootstrap(gpa: std.mem.Allocator, mode: output.Mode) void {
    if (mode == .human) {
        output.writeLine("\n  SuperCLI (Zig)\n");
        output.writeLine("  Clean-room Zig implementation of the SuperCLI core.\n");
        output.writeLine("  Usage: sc-zig <namespace> <resource> <action> [--flags]");
        output.writeLine("  Flags:  --json | --human | --compact");
        output.writeLine("  Cmds:   help | commands | inspect | plugins list | plugins update\n");
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
    jw.write("Clean-room Zig implementation of SuperCLI core. Reads ~/.supercli/plugins/plugins.lock.json.") catch return;
    jw.objectField("first_steps") catch return;
    jw.beginArray() catch return;
    jw.write("sc-zig commands --json") catch return;
    jw.write("sc-zig <namespace> <resource> <action> --json") catch return;
    jw.write("sc-zig plugins list --json") catch return;
    jw.write("sc-zig plugins update --json") catch return;
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

    // Build extra args from user flags (skip reserved + supercli-specific)
    var skip_keys: std.ArrayList([]const u8) = .empty;
    for (RESERVED_FLAGS) |k| try skip_keys.append(gpa, k);
    try skip_keys.append(gpa, "limit");
    try skip_keys.append(gpa, "query");

    const extra_args = if (is_passthrough or acfg.passthrough)
        passthrough_args
    else
        try executor.buildFlagArgs(gpa, flags, skip_keys.items);

    const exec_result = try executor.executeProcess(io, gpa, acfg.command, .{
        .base_args = acfg.base_args,
        .extra_args = extra_args,
        .passthrough = is_passthrough or acfg.passthrough,
        .parse_json = acfg.parse_json,
        .timeout_ms = acfg.timeout_ms,
        .cwd = acfg.cwd,
    });

    const duration = std.Io.Timestamp.now(io, .real).toMilliseconds() - start;

    switch (exec_result) {
        .passthrough => return, // stdio was inherited, nothing to emit
        .err => |e| {
            output.exitWithError(gpa, mode, .{
                .code = 105,
                .err_type = "integration_error",
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

    const parsed = try parseArgs(gpa, io, raw_argv);
    const mode = parsed.mode;
    const pos = parsed.positional;

    const home = init.environ_map.get("HOME") orelse "/tmp";

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
            const plugins_path = try pluginsDir(gpa, io);
            const plugins = try registry.discoverPluginsInDir(io, gpa, plugins_path);

            const name_query = parsed.flags.get("name") orelse "";

            var filtered: []registry.RegistryPlugin = plugins;
            if (name_query.len > 0) {
                filtered = try registry.filterByName(plugins, name_query, gpa);
            }

            if (mode == .human) {
                output.writeLine("\n  Plugins\n");
                for (filtered) |p| {
                    var buf: [256]u8 = undefined;
                    const line = std.fmt.bufPrint(&buf, "  {s}  {s}\n", .{ p.name, p.description }) catch continue;
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
            jw.write(filtered.len) catch return;
            jw.objectField("plugins") catch return;
            jw.beginArray() catch return;
            for (filtered) |p| {
                jw.beginObject() catch return;
                jw.objectField("name") catch return;
                jw.write(p.name) catch return;
                jw.objectField("description") catch return;
                jw.write(p.description) catch return;
                jw.objectField("has_learn") catch return;
                jw.write(p.has_learn) catch return;
                jw.endObject() catch return;
            }
            jw.endArray() catch return;
            jw.endObject() catch return;
            output.writeRaw(out.written());
            output.writeRaw("\n");
            return;
        }

        // Unknown plugins subcommand
        output.exitWithError(gpa, mode, .{
            .code = 85,
            .err_type = "invalid_argument",
            .message = "Unknown plugins subcommand. Use: list | explore | update",
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
        try handleExecuteCommand(io, gpa, mode, cmd, parsed.flags, passthrough_args, user_passthrough);
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
