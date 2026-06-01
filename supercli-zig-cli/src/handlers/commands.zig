// commands.zig — handleCommands, handleInspect
const std = @import("std");
const output = @import("../output.zig");
const config = @import("../config.zig");

pub fn handleCommands(
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

    const limit: usize = blk: {
        const limit_str = flags.get("limit") orelse flags.get("l") orelse "";
        if (limit_str.len == 0) break :blk 0;
        break :blk std.fmt.parseInt(usize, limit_str, 10) catch {
            output.exitWithError(gpa, mode, .{
                .code = 85,
                .err_type = "invalid_argument",
                .message = "Invalid value for --limit flag",
                .recoverable = false,
            });
        };
    };

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

pub fn handleInspect(
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
            .suggestions = &.{"Run: sc-zig commands"},
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
