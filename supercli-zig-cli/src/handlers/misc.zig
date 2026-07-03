// misc.zig — `config show` and `plan <ns> <res> <act>` handlers
// Phase 4 quality & polish commands.
const std = @import("std");
const output = @import("../output.zig");
const config = @import("../config.zig");
const executor = @import("../executor.zig");

pub fn handleConfigShow(
    io: std.Io,
    gpa: std.mem.Allocator,
    mode: output.Mode,
    home: []const u8,
) !void {
    var lock = try config.readLock(io, home, gpa);
    defer lock.deinit();

    const lock_path = try std.fmt.allocPrint(gpa, "{s}/{s}", .{ home, config.LOCK_FILE });
    defer gpa.free(lock_path);

    const cmd_count = blk: {
        var count: usize = 0;
        for (lock.plugins) |p| count += p.commands.len;
        break :blk count;
    };

    if (mode == .human) {
        output.writeLine("\n  SuperCLI Config\n");
        var buf: [512]u8 = undefined;
        const line = std.fmt.bufPrint(&buf, "  Lockfile:  {s}\n  Plugins:   {d}\n  Commands:  {d}\n\n", .{
            lock_path, lock.plugins.len, cmd_count,
        }) catch "";
        output.writeRaw(line);
        return;
    }

    var out: std.Io.Writer.Allocating = .init(gpa);
    defer out.deinit();
    var jw: std.json.Stringify = .{ .writer = &out.writer };
    jw.beginObject() catch return;
    jw.objectField("lockfile") catch return;
    jw.write(lock_path) catch return;
    jw.objectField("plugins") catch return;
    jw.write(lock.plugins.len) catch return;
    jw.objectField("commands") catch return;
    jw.write(cmd_count) catch return;
    jw.endObject() catch return;
    output.writeRaw(out.written());
    output.writeRaw("\n");
}

pub fn handlePlan(
    io: std.Io,
    gpa: std.mem.Allocator,
    mode: output.Mode,
    pos: [][]const u8,
    home: []const u8,
) !void {
    if (pos.len < 4) {
        output.exitWithError(gpa, mode, .{
            .code = 85,
            .err_type = "invalid_argument",
            .message = "Usage: sc-zig plan <namespace> <resource> <action>",
            .recoverable = false,
        });
    }

    const ns = pos[1];
    const res = pos[2];
    const act = pos[3];

    var lock = try config.readLock(io, home, gpa);
    defer lock.deinit();

    const cmd = config.findCommand(&lock, ns, res, act) orelse {
        output.exitWithError(gpa, mode, .{
            .code = 92,
            .err_type = "resource_not_found",
            .message = "Command not found",
            .recoverable = false,
            .suggestions = &.{"Run: sc-zig commands"},
        });
    };

    const arg_defs = try executor.parseArgDefs(gpa, cmd.args_raw);
    defer gpa.free(arg_defs);

    if (mode == .human) {
        output.writeLine("\n  Execution Plan\n");
        var buf: [512]u8 = undefined;
        const cmd_line = std.fmt.bufPrint(&buf, "  Command:  {s} {s} {s}\n  Adapter:  {s}\n  Description: {s}\n", .{
            ns, res, act, cmd.adapter, cmd.description,
        }) catch "";
        output.writeRaw(cmd_line);

        if (arg_defs.len > 0) {
            output.writeLine("  Arguments:");
            for (arg_defs) |arg| {
                var abuf: [256]u8 = undefined;
                const req = if (arg.required) "required" else "optional";
                const arg_line = std.fmt.bufPrint(&abuf, "    --{s}  [{s}]  {s}\n", .{
                    arg.name, if (arg.is_bool) "bool" else "string", req,
                }) catch continue;
                output.writeRaw(arg_line);
            }
        }
        output.writeLine("\n  (dry-run — no execution performed)\n");
        return;
    }

    var out: std.Io.Writer.Allocating = .init(gpa);
    defer out.deinit();
    var jw: std.json.Stringify = .{ .writer = &out.writer };
    jw.beginObject() catch return;
    jw.objectField("mode") catch return;
    jw.write("plan") catch return;
    jw.objectField("command") catch return;
    const full_cmd = try std.fmt.allocPrint(gpa, "{s}.{s}.{s}", .{ ns, res, act });
    defer gpa.free(full_cmd);
    jw.write(full_cmd) catch return;
    jw.objectField("adapter") catch return;
    jw.write(cmd.adapter) catch return;
    jw.objectField("description") catch return;
    jw.write(cmd.description) catch return;
    jw.objectField("args") catch return;
    jw.beginArray() catch return;
    for (arg_defs) |arg| {
        jw.beginObject() catch return;
        jw.objectField("name") catch return;
        jw.write(arg.name) catch return;
        jw.objectField("type") catch return;
        jw.write(if (arg.is_bool) "bool" else "string") catch return;
        jw.objectField("required") catch return;
        jw.write(arg.required) catch return;
        jw.objectField("is_bool") catch return;
        jw.write(arg.is_bool) catch return;
        jw.endObject() catch return;
    }
    jw.endArray() catch return;
    jw.objectField("dry_run") catch return;
    jw.write(true) catch return;
    jw.endObject() catch return;
    output.writeRaw(out.written());
    output.writeRaw("\n");
}
