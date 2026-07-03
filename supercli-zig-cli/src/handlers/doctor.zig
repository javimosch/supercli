// doctor.zig — `sc plugins doctor [name]` — check binary availability for plugins
// Mirrors cli/plugins-doctor.js.
const std = @import("std");
const output = @import("../output.zig");
const config = @import("../config.zig");
const lockfile = @import("../lockfile.zig");

pub fn handlePluginsDoctor(
    io: std.Io,
    gpa: std.mem.Allocator,
    mode: output.Mode,
    pos: [][]const u8,
    home: []const u8,
) !void {
    const target = if (pos.len > 2) pos[2] else "";

    if (target.len > 0) {
        try doctorOne(io, gpa, mode, target, home);
    } else {
        try doctorAll(io, gpa, mode, home);
    }
}

fn checkBinary(gpa: std.mem.Allocator, io: std.Io, binary: []const u8, args: []const []const u8) !struct { ok: bool, message: []const u8 } {
    var full_args: std.ArrayList([]const u8) = .empty;
    try full_args.append(gpa, binary);
    if (args.len == 0) {
        try full_args.append(gpa, "--version");
    } else {
        for (args) |a| try full_args.append(gpa, a);
    }

    const result = std.process.run(gpa, io, .{
        .argv = full_args.items,
        .cwd = .inherit,
        .stdout_limit = .unlimited,
        .stderr_limit = .unlimited,
    }) catch {
        return .{ .ok = false, .message = "not installed" };
    };

    if (result.term == .exited and result.term.exited == 0) {
        const msg = std.mem.trim(u8, result.stdout, "\n\r ");
        return .{ .ok = true, .message = try gpa.dupe(u8, msg) };
    }

    const stderr_msg = std.mem.trim(u8, result.stderr, "\n\r ");
    if (stderr_msg.len > 0) {
        return .{ .ok = false, .message = try gpa.dupe(u8, stderr_msg) };
    }
    const exit_code: u8 = switch (result.term) {
        .exited => |c| c,
        else => 1,
    };
    const msg = try std.fmt.allocPrint(gpa, "exit {d}", .{exit_code});
    return .{ .ok = false, .message = msg };
}

fn doctorOne(io: std.Io, gpa: std.mem.Allocator, mode: output.Mode, name: []const u8, home: []const u8) !void {
    var lock = try config.readLock(io, home, gpa);
    defer lock.deinit();

    var found_plugin: ?config.Plugin = null;
    for (lock.plugins) |p| {
        if (std.mem.eql(u8, p.name, name)) {
            found_plugin = p;
            break;
        }
    }

    if (found_plugin == null) {
        output.exitWithError(gpa, mode, .{
            .code = 92,
            .err_type = "resource_not_found",
            .message = "Plugin not installed",
            .recoverable = false,
            .suggestions = &.{"Run: sc-zig plugins list"},
        });
    }

    const plugin = found_plugin.?;

    // Read raw lockfile to get checks array
    const lock_raw = try lockfile.readLockRaw(io, gpa, home);
    var checks_json: ?std.json.Value = null;
    const plugins_arr = switch (lock_raw) {
        .object => |o| blk: {
            const plugins_val = o.get("plugins") orelse break :blk null;
            break :blk switch (plugins_val) {
                .array => plugins_val.array.items,
                else => null,
            };
        },
        else => null,
    };
    if (plugins_arr) |arr| {
        for (arr) |item| switch (item) {
            .object => |obj| {
                const pname = if (obj.get("name")) |v| switch (v) {
                    .string => |s| s,
                    else => continue,
                } else continue;
                if (std.mem.eql(u8, pname, name)) {
                    checks_json = obj.get("checks");
                    break;
                }
            },
            else => {},
        };
    }

    var checks: std.ArrayList(struct { check_type: []const u8, binary: []const u8, ok: bool, message: []const u8 }) = .empty;

    if (checks_json) |cj| switch (cj) {
        .array => |ca| {
            for (ca.items) |check| switch (check) {
                .object => |co| {
                    const check_type = if (co.get("type")) |v| switch (v) {
                        .string => |s| s,
                        else => continue,
                    } else continue;
                    if (!std.mem.eql(u8, check_type, "binary")) continue;
                    const binary_name = if (co.get("name")) |v| switch (v) {
                        .string => |s| s,
                        else => continue,
                    } else continue;

                    // Parse args if present
                    var check_args: []const []const u8 = &.{};
                    if (co.get("args")) |av| switch (av) {
                        .array => |aa| {
                            const allocated = try gpa.alloc([]const u8, aa.items.len);
                            for (aa.items, 0..) |ai, i| {
                                allocated[i] = switch (ai) {
                                    .string => |s| s,
                                    else => "",
                                };
                            }
                            check_args = allocated;
                        },
                        else => {},
                    };

                    const result = try checkBinary(gpa, io, binary_name, check_args);
                    try checks.append(gpa, .{
                        .check_type = "binary",
                        .binary = binary_name,
                        .ok = result.ok,
                        .message = result.message,
                    });
                },
                else => {},
            };
        },
        else => {},
    };

    const all_ok = blk: {
        for (checks.items) |c| if (!c.ok) break :blk false;
        break :blk true;
    };

    if (mode == .human) {
        var buf: [256]u8 = undefined;
        const header = std.fmt.bufPrint(&buf, "\n  Doctor: {s}  [{s}]\n\n", .{
            name, if (all_ok) "OK" else "FAIL",
        }) catch "";
        output.writeRaw(header);
        for (checks.items) |c| {
            const status = if (c.ok) "✓" else "✗";
            var cbuf: [256]u8 = undefined;
            const line = std.fmt.bufPrint(&cbuf, "  {s} {s}: {s}\n", .{ status, c.binary, c.message }) catch continue;
            output.writeRaw(line);
        }
        if (checks.items.len == 0) output.writeLine("  No binary checks defined for this plugin.");
        output.writeLine("");
        return;
    }

    var out: std.Io.Writer.Allocating = .init(gpa);
    defer out.deinit();
    var jw: std.json.Stringify = .{ .writer = &out.writer };
    jw.beginObject() catch return;
    jw.objectField("plugin") catch return;
    jw.write(name) catch return;
    jw.objectField("ok") catch return;
    jw.write(all_ok) catch return;
    jw.objectField("commands") catch return;
    jw.write(plugin.commands.len) catch return;
    jw.objectField("checks") catch return;
    jw.beginArray() catch return;
    for (checks.items) |c| {
        jw.beginObject() catch return;
        jw.objectField("type") catch return;
        jw.write(c.check_type) catch return;
        jw.objectField("binary") catch return;
        jw.write(c.binary) catch return;
        jw.objectField("ok") catch return;
        jw.write(c.ok) catch return;
        jw.objectField("message") catch return;
        jw.write(c.message) catch return;
        jw.endObject() catch return;
    }
    jw.endArray() catch return;
    jw.endObject() catch return;
    output.writeRaw(out.written());
    output.writeRaw("\n");
}

fn doctorAll(io: std.Io, gpa: std.mem.Allocator, mode: output.Mode, home: []const u8) !void {
    var lock = try config.readLock(io, home, gpa);
    defer lock.deinit();

    if (mode == .human) {
        output.writeLine("\n  Plugin Doctor\n");
        for (lock.plugins) |p| {
            var buf: [256]u8 = undefined;
            const line = std.fmt.bufPrint(&buf, "  {s}  ({d} commands)\n", .{ p.name, p.commands.len }) catch continue;
            output.writeRaw(line);
        }
        output.writeLine("");
        return;
    }

    var out: std.Io.Writer.Allocating = .init(gpa);
    defer out.deinit();
    var jw: std.json.Stringify = .{ .writer = &out.writer };
    jw.beginObject() catch return;
    jw.objectField("total_plugins") catch return;
    jw.write(lock.plugins.len) catch return;
    jw.objectField("plugins") catch return;
    jw.beginArray() catch return;
    for (lock.plugins) |p| {
        jw.beginObject() catch return;
        jw.objectField("name") catch return;
        jw.write(p.name) catch return;
        jw.objectField("commands") catch return;
        jw.write(p.commands.len) catch return;
        jw.endObject() catch return;
    }
    jw.endArray() catch return;
    jw.endObject() catch return;
    output.writeRaw(out.written());
    output.writeRaw("\n");
}
