// main.zig — SuperCLI Zig CLI entry point. Pure router; all logic is in sub-modules.
// Compatible with ~/.supercli/plugins/plugins.lock.json.
const std = @import("std");
const output = @import("output.zig");
const config = @import("config.zig");
const executor = @import("executor.zig");
const args_mod = @import("args.zig");
const bootstrap = @import("handlers/bootstrap.zig");
const commands = @import("handlers/commands.zig");
const plugins = @import("handlers/plugins.zig");
const execute = @import("handlers/execute.zig");
const learn = @import("handlers/learn.zig");
const install = @import("handlers/install.zig");
const discover = @import("handlers/discover.zig");
const help = @import("handlers/help.zig");
const skills = @import("handlers/skills.zig");
const run = @import("handlers/run.zig");
const doctor = @import("handlers/doctor.zig");
const onboard = @import("handlers/onboard.zig");
const misc = @import("handlers/misc.zig");
const daemon = @import("handlers/daemon.zig");

pub fn main(init: std.process.Init) !void {
    const gpa = init.gpa;
    const io = init.io;

    // Collect raw argv (skip binary name), check for early flags
    var args_list: std.ArrayList([]const u8) = .empty;
    var args_it = std.process.Args.Iterator.init(init.minimal.args);
    _ = args_it.next(); // skip binary name
    var has_version_flag = false;
    var has_json_flag = false;
    while (args_it.next()) |arg| {
        try args_list.append(gpa, arg);
        if (std.mem.eql(u8, arg, "--version") or std.mem.eql(u8, arg, "--info")) has_version_flag = true;
        if (std.mem.eql(u8, arg, "--json")) has_json_flag = true;
    }
    const raw_argv = try args_list.toOwnedSlice(gpa);

    if (has_version_flag) {
        const mode = if (has_json_flag) output.Mode.json else output.Mode.human;
        bootstrap.handleVersionInfo(gpa, mode);
        return;
    }

    var parsed = try args_mod.parseArgs(gpa, raw_argv, null);
    defer parsed.deinit();
    const mode = parsed.mode;
    const pos = parsed.positional;

    const home = init.environ_map.get("HOME") orelse init.environ_map.get("USERPROFILE") orelse "/tmp";

    // ----- help / --help / --help-json -----
    if (parsed.flags.get("help-json") != null) {
        help.handleHelpJson(gpa);
        return;
    }
    if (parsed.flags.get("help") != null) {
        help.handleHelp(gpa, mode);
        return;
    }
    if (pos.len > 0 and std.mem.eql(u8, pos[0], "help")) {
        help.handleHelp(gpa, mode);
        return;
    }

    // ----- No args → bootstrap -----
    if (pos.len == 0) { bootstrap.handleBootstrap(gpa, mode); return; }

    // ----- install-as-sc -----
    if (std.mem.eql(u8, pos[0], "install-as-sc")) { bootstrap.handleInstallAsSc(io, gpa, mode); return; }

    // ----- commands -----
    if (std.mem.eql(u8, pos[0], "commands")) {
        var lock = try config.readLock(io, home, gpa);
        defer lock.deinit();
        try commands.handleCommands(gpa, &lock, mode, parsed.flags);
        return;
    }

    // ----- inspect <ns> <res> <act> -----
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
        commands.handleInspect(gpa, &lock, mode, pos[1], pos[2], pos[3]);
        return;
    }

    // ----- plugins <sub> -----
    if (std.mem.eql(u8, pos[0], "plugins")) {
        const sub = if (pos.len > 1) pos[1] else "";

        if (std.mem.eql(u8, sub, "list") or std.mem.eql(u8, sub, "ls")) {
            var lock = try config.readLock(io, home, gpa);
            defer lock.deinit();
            plugins.handlePluginsList(gpa, &lock, mode);
            return;
        }
        if (std.mem.eql(u8, sub, "update")) {
            try plugins.handlePluginsUpdate(io, gpa, mode, parsed.flags, home);
            return;
        }
        if (std.mem.eql(u8, sub, "explore")) {
            try plugins.handlePluginsExplore(io, gpa, mode, parsed.flags, home);
            return;
        }
        if (std.mem.eql(u8, sub, "install")) {
            const plugin_name = if (pos.len > 2) pos[2] else "";
            const on_conflict = if (parsed.flags.get("on-conflict")) |v| v else "fail";
            try install.handlePluginsInstallNative(io, gpa, mode, plugin_name, home, on_conflict);
            return;
        }
        if (std.mem.eql(u8, sub, "remove") or std.mem.eql(u8, sub, "uninstall")) {
            const plugin_name = if (pos.len > 2) pos[2] else "";
            try plugins.handlePluginsRemove(io, gpa, mode, plugin_name, home);
            return;
        }
        if (std.mem.eql(u8, sub, "show")) {
            const plugin_name = if (pos.len > 2) pos[2] else "";
            try plugins.handlePluginsShow(io, gpa, mode, plugin_name, home);
            return;
        }
        if (std.mem.eql(u8, sub, "learn")) {
            const plugin_name = if (pos.len > 2) pos[2] else "";
            try learn.handlePluginsLearn(io, gpa, mode, plugin_name, home);
            return;
        }
        if (std.mem.eql(u8, sub, "doctor")) {
            try doctor.handlePluginsDoctor(io, gpa, mode, pos, home);
            return;
        }
        output.exitWithError(gpa, mode, .{
            .code = 85,
            .err_type = "invalid_argument",
            .message = "Unknown plugins subcommand. Use: list | explore | install | remove | show | learn | doctor | update",
            .recoverable = false,
        });
    }

    // ----- skills <sub> -----
    if (std.mem.eql(u8, pos[0], "skills")) {
        try skills.handleSkills(io, gpa, mode, pos, parsed.flags, home);
        return;
    }

    // ----- run <plugin> <res> <act> -----
    if (std.mem.eql(u8, pos[0], "run")) {
        try run.handleRun(io, gpa, mode, pos, parsed.flags, raw_argv, home);
        return;
    }

    // ----- plan <ns> <res> <act> -----
    if (std.mem.eql(u8, pos[0], "plan")) {
        try misc.handlePlan(io, gpa, mode, pos, home);
        return;
    }

    // ----- config show -----
    if (std.mem.eql(u8, pos[0], "config")) {
        const sub = if (pos.len > 1) pos[1] else "";
        if (std.mem.eql(u8, sub, "show")) {
            try misc.handleConfigShow(io, gpa, mode, home);
            return;
        }
        output.exitWithError(gpa, mode, .{
            .code = 85,
            .err_type = "invalid_argument",
            .message = "Usage: sc-zig config show",
            .recoverable = false,
        });
    }

    // ----- onboard / offboard -----
    if (std.mem.eql(u8, pos[0], "onboard")) {
        try onboard.handleOnboard(io, gpa, mode, parsed.flags);
        return;
    }
    if (std.mem.eql(u8, pos[0], "offboard")) {
        try onboard.handleOffboard(io, gpa, mode, parsed.flags);
        return;
    }

    // ----- daemon <start|stop|status> -----
    if (std.mem.eql(u8, pos[0], "daemon")) {
        try daemon.handleDaemon(io, gpa, mode, pos, home);
        return;
    }

    // ----- discover --intent -----
    if (std.mem.eql(u8, pos[0], "discover")) {
        try discover.handleDiscover(io, gpa, mode, parsed.flags, home);
        return;
    }

    // ----- Namespace dispatch -----
    var lock = try config.readLock(io, home, gpa);
    defer lock.deinit();

    const ns = pos[0];

    // Namespace browse: 1 positional → list resources/actions under namespace
    // 2 positionals → list actions under namespace.resource
    if (pos.len <= 2) {
        // First check if there's a passthrough command for this namespace
        if (config.findPassthrough(&lock, ns)) |cmd| {
            const passthrough_args: [][]const u8 = if (pos.len > 1) raw_argv[1..] else raw_argv[0..0];
            try execute.handleExecuteCommand(io, gpa, mode, cmd, parsed.flags, passthrough_args, true);
            return;
        }
        try handleNamespaceBrowse(gpa, &lock, mode, ns, if (pos.len > 1) pos[1] else null);
        return;
    }

    const res = pos[1];
    const act = pos[2];

    // --schema flag: output command schema instead of executing
    if (parsed.flags.contains("schema")) {
        commands.handleInspect(gpa, &lock, mode, ns, res, act);
        return;
    }

    var passthrough_args: [][]const u8 = raw_argv[1..];
    _ = &passthrough_args;        // Exact ns.res.act match
        if (config.findCommand(&lock, ns, res, act)) |cmd| {
            const user_passthrough = std.mem.eql(u8, res, "_") and std.mem.eql(u8, act, "_");
            const arg_defs = try executor.parseArgDefs(gpa, cmd.args_raw);
            defer gpa.free(arg_defs);

            var custom_bool_flags = std.StringHashMap(void).init(gpa);
            defer custom_bool_flags.deinit();
            for (arg_defs) |arg| {
                if (arg.is_bool) try custom_bool_flags.put(arg.name, {});
            }

            var cmd_parsed = try args_mod.parseArgs(gpa, raw_argv, custom_bool_flags);
            defer cmd_parsed.deinit();

            // Strip the 3 routing args (ns, res, act) from passthrough so they
            // don't get forwarded as literal arguments to the underlying CLI.
            // e.g. "sc-zig petname alias generate --words 3" → passthrough args = ["--words", "3"]
            const cmd_passthrough_args = if (cmd_parsed.positional.len > 3) raw_argv[3..] else raw_argv[0..0];
            try execute.handleExecuteCommand(io, gpa, mode, cmd, cmd_parsed.flags, cmd_passthrough_args, user_passthrough);
            return;
        }

    // Passthrough command for namespace
    if (config.findPassthrough(&lock, ns)) |cmd| {
        try execute.handleExecuteCommand(io, gpa, mode, cmd, parsed.flags, passthrough_args, true);
        return;
    }

    // Namespace existence check for better error messages
    var ns_found = false;
    for (lock.plugins) |p| {
        for (p.commands) |cmd| {
            if (std.mem.eql(u8, cmd.namespace, ns)) { ns_found = true; break; }
        }
        if (ns_found) break;
    }

    if (ns_found) {
        output.exitWithError(gpa, mode, .{
            .code = 92,
            .err_type = "resource_not_found",
            .message = "Command not found in this namespace",
            .recoverable = false,
            .suggestions = &.{"Run: sc-zig commands"},
        });
    } else {
        output.exitWithError(gpa, mode, .{
            .code = 92,
            .err_type = "resource_not_found",
            .message = "Namespace not found. Is the plugin installed?",
            .recoverable = false,
            .suggestions = &.{
                "Run: sc-zig plugins list",
                "Run: sc-zig plugins install <name>",
            },
        });
    }
}

fn handleNamespaceBrowse(
    gpa: std.mem.Allocator,
    lock: *const config.Lock,
    mode: output.Mode,
    ns: []const u8,
    maybe_res: ?[]const u8,
) !void {
    // Collect matching commands
    var cmds: std.ArrayList(config.Command) = .empty;
    for (lock.plugins) |p| {
        for (p.commands) |cmd| {
            if (!std.mem.eql(u8, cmd.namespace, ns)) continue;
            if (maybe_res) |res| {
                if (!std.mem.eql(u8, cmd.resource, res)) continue;
            }
            try cmds.append(gpa, cmd);
        }
    }

    if (cmds.items.len == 0) {
        // Check if namespace exists at all
        var ns_found = false;
        for (lock.plugins) |p| {
            for (p.commands) |cmd| {
                if (std.mem.eql(u8, cmd.namespace, ns)) { ns_found = true; break; }
            }
            if (ns_found) break;
        }
        if (ns_found and maybe_res != null) {
            output.exitWithError(gpa, mode, .{
                .code = 92,
                .err_type = "resource_not_found",
                .message = "Resource not found in this namespace",
                .recoverable = false,
                .suggestions = &.{"Run: sc-zig commands --namespace <ns>"},
            });
        }
        output.exitWithError(gpa, mode, .{
            .code = 92,
            .err_type = "resource_not_found",
            .message = "Namespace not found. Is the plugin installed?",
            .recoverable = false,
            .suggestions = &.{
                "Run: sc-zig plugins list",
                "Run: sc-zig plugins install <name>",
            },
        });
    }

    if (mode == .human) {
        if (maybe_res) |res| {
            var buf: [256]u8 = undefined;
            const header = std.fmt.bufPrint(&buf, "\n  {s}.{s}\n\n", .{ ns, res }) catch "";
            output.writeRaw(header);
        } else {
            var buf: [256]u8 = undefined;
            const header = std.fmt.bufPrint(&buf, "\n  Namespace: {s}\n\n", .{ns}) catch "";
            output.writeRaw(header);
        }
        for (cmds.items) |cmd| {
            var buf: [512]u8 = undefined;
            const line = std.fmt.bufPrint(&buf, "  {s} {s} {s}  [{s}]  {s}\n", .{
                cmd.namespace, cmd.resource, cmd.action, cmd.adapter, cmd.description,
            }) catch continue;
            output.writeRaw(line);
        }
        output.writeLine("");
        return;
    }

    // JSON output
    var out: std.Io.Writer.Allocating = .init(gpa);
    defer out.deinit();
    var jw: std.json.Stringify = .{ .writer = &out.writer };
    jw.beginObject() catch return;
    jw.objectField("namespace") catch return;
    jw.write(ns) catch return;
    if (maybe_res) |res| {
        jw.objectField("resource") catch return;
        jw.write(res) catch return;
    }
    jw.objectField("commands") catch return;
    jw.beginArray() catch return;
    for (cmds.items) |cmd| {
        jw.beginObject() catch return;
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
