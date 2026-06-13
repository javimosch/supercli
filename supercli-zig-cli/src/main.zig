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

    // ----- No args → bootstrap -----
    if (pos.len == 0) { bootstrap.handleBootstrap(gpa, mode); return; }

    // ----- help -----
    if (std.mem.eql(u8, pos[0], "help")) { bootstrap.handleBootstrap(gpa, mode); return; }

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
            plugins.handlePluginsInstall(io, gpa, mode, plugin_name);
            return;
        }
        output.exitWithError(gpa, mode, .{
            .code = 85,
            .err_type = "invalid_argument",
            .message = "Unknown plugins subcommand. Use: list | explore | install | update",
            .recoverable = false,
        });
    }

    // ----- Namespace dispatch -----
    var lock = try config.readLock(io, home, gpa);
    defer lock.deinit();

    const ns = pos[0];
    const res = if (pos.len > 1) pos[1] else "_";
    const act = if (pos.len > 2) pos[2] else "_";

    var passthrough_args: [][]const u8 = if (pos.len > 1) raw_argv[1..] else raw_argv[0..0];
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
                "Run: sc plugins install <name>",
            },
        });
    }
}
