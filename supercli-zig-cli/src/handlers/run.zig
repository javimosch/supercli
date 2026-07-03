// run.zig — `sc run <plugin> <res> <act>` one-shot: update → install → execute
// Mirrors cli/run.js handleRunCommand.
const std = @import("std");
const output = @import("../output.zig");
const config = @import("../config.zig");
const executor = @import("../executor.zig");
const args_mod = @import("../args.zig");
const execute = @import("execute.zig");
const install = @import("install.zig");
const plugins = @import("plugins.zig");

pub fn handleRun(
    io: std.Io,
    gpa: std.mem.Allocator,
    mode: output.Mode,
    pos: [][]const u8,
    flags: std.StringHashMap([]const u8),
    raw_argv: [][]const u8,
    home: []const u8,
) !void {
    if (pos.len < 4) {
        output.exitWithError(gpa, mode, .{
            .code = 85,
            .err_type = "invalid_argument",
            .message = "Usage: sc-zig run <plugin> <resource> <action> [--args]",
            .recoverable = false,
            .suggestions = &.{"Example: sc-zig run uuid-cli uuid generate"},
        });
    }

    const plugin_name = pos[1];
    const res = pos[2];
    const act = pos[3];

    // Step 1: Check if plugin is already installed
    var lock = try config.readLock(io, home, gpa);
    var already_installed = false;
    for (lock.plugins) |p| {
        if (std.mem.eql(u8, p.name, plugin_name)) {
            already_installed = true;
            break;
        }
    }

    // Step 2: If not installed, try update then install
    if (!already_installed) {
        if (mode == .human) {
            output.writeRawErr("Syncing plugin catalog...\n");
            plugins.handlePluginsUpdate(io, gpa, mode, flags, home) catch {
                output.writeRawErr("  Catalog sync failed, continuing with local catalog\n");
            };
        }
        // Reload lock after update
        lock.deinit();
        lock = try config.readLock(io, home, gpa);
        // Re-check if plugin is installed
        for (lock.plugins) |p| {
            if (std.mem.eql(u8, p.name, plugin_name)) {
                already_installed = true;
                break;
            }
        }
    }

    if (!already_installed) {
        if (mode == .human) {
            var buf: [256]u8 = undefined;
            const msg = std.fmt.bufPrint(&buf, "Installing plugin: {s}...\n", .{plugin_name}) catch "";
            output.writeRawErr(msg);
        }
        const on_conflict = flags.get("on-conflict") orelse "replace";
        try install.handlePluginsInstallNative(io, gpa, mode, plugin_name, home, on_conflict);
        // Reload lock after install
        lock.deinit();
        lock = try config.readLock(io, home, gpa);
    }

    // Step 3: Find and execute command
    defer lock.deinit();
    const cmd = config.findCommand(&lock, plugin_name, res, act) orelse {
        output.exitWithError(gpa, mode, .{
            .code = 92,
            .err_type = "resource_not_found",
            .message = "Command not found after install",
            .recoverable = false,
            .suggestions = &.{
                "Run: sc-zig plugins explore --name <plugin> --json",
                "Run: sc-zig commands --namespace <plugin>",
            },
        });
    };

    // Re-parse args with command-specific bool flags
    const arg_defs = try executor.parseArgDefs(gpa, cmd.args_raw);
    defer gpa.free(arg_defs);

    var custom_bool_flags = std.StringHashMap(void).init(gpa);
    defer custom_bool_flags.deinit();
    for (arg_defs) |arg| {
        if (arg.is_bool) try custom_bool_flags.put(arg.name, {});
    }

    var cmd_parsed = try args_mod.parseArgs(gpa, raw_argv, custom_bool_flags);
    defer cmd_parsed.deinit();

    const passthrough_args = if (cmd_parsed.positional.len > 4) raw_argv[4..] else raw_argv[0..0];
    const user_passthrough = std.mem.eql(u8, res, "_") and std.mem.eql(u8, act, "_");
    try execute.handleExecuteCommand(io, gpa, mode, cmd, cmd_parsed.flags, passthrough_args, user_passthrough);
}
