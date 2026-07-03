// install.zig — Native plugins install (no Node.js delegation)
// Reads bundled plugin.json, parses manifest, writes to lockfile.
const std = @import("std");
const output = @import("../output.zig");
const lockfile = @import("../lockfile.zig");

const plugins_handler = @import("plugins.zig");

pub fn handlePluginsInstallNative(
    io: std.Io,
    gpa: std.mem.Allocator,
    mode: output.Mode,
    plugin_name: []const u8,
    home: []const u8,
    on_conflict: []const u8,
) !void {
    if (plugin_name.len == 0) {
        output.exitWithError(gpa, mode, .{
            .code = 85,
            .err_type = "invalid_argument",
            .message = "Usage: sc-zig plugins install <name>",
            .recoverable = false,
            .suggestions = &.{"Run: sc-zig plugins explore --name <query>"},
        });
    }

    var arena = std.heap.ArenaAllocator.init(gpa);
    defer arena.deinit();
    const arena_alloc = arena.allocator();

    // 1. Find plugin manifest in bundled registry
    const plugins_dir = try plugins_handler.bundledPluginsDir(arena_alloc, io, home);
    const manifest_path = try std.fmt.allocPrint(arena_alloc, "{s}/{s}/plugin.json", .{ plugins_dir, plugin_name });

    const manifest_content = std.Io.Dir.cwd().readFileAlloc(io, manifest_path, arena_alloc, .unlimited) catch {
        output.exitWithError(gpa, mode, .{
            .code = 92,
            .err_type = "resource_not_found",
            .message = "Plugin not found in registry",
            .recoverable = false,
            .suggestions = &.{
                "Run: sc-zig plugins explore --name <query>",
                "Run: sc-zig plugins update",
            },
        });
    };

    const manifest_parsed = std.json.parseFromSliceLeaky(std.json.Value, arena_alloc, manifest_content, .{}) catch {
        output.exitWithError(gpa, mode, .{
            .code = 110,
            .err_type = "internal_error",
            .message = "Failed to parse plugin manifest",
            .recoverable = false,
        });
    };
    const manifest_obj = switch (manifest_parsed) {
        .object => |o| o,
        else => output.exitWithError(gpa, mode, .{
            .code = 110,
            .err_type = "internal_error",
            .message = "Invalid manifest format",
            .recoverable = false,
        }),
    };

    // 2. Extract plugin metadata
    const name = blk: {
        if (manifest_obj.get("name")) |n| switch (n) {
            .string => |s| break :blk s,
            else => {},
        };
        output.exitWithError(gpa, mode, .{
            .code = 110,
            .err_type = "internal_error",
            .message = "Manifest missing 'name' field",
            .recoverable = false,
        });
    };

    const version = if (manifest_obj.get("version")) |v| switch (v) {
        .string => |s| s,
        else => "0.0.0",
    } else "0.0.0";

    const description = if (manifest_obj.get("description")) |v| switch (v) {
        .string => |s| s,
        else => "",
    } else "";

    const source = if (manifest_obj.get("source")) |v| switch (v) {
        .string => |s| s,
        else => plugin_name,
    } else plugin_name;

    const commands_val = manifest_obj.get("commands") orelse output.exitWithError(gpa, mode, .{
        .code = 110,
        .err_type = "internal_error",
        .message = "Manifest missing 'commands' field",
        .recoverable = false,
    });

    // 3. Read existing lockfile
    var lock_raw = lockfile.readLockRaw(io, arena_alloc, home) catch blk: {
        var empty_out: std.Io.Writer.Allocating = .init(arena_alloc);
        var ejw: std.json.Stringify = .{ .writer = &empty_out.writer };
        ejw.beginObject() catch return error.JsonError;
        ejw.objectField("version") catch return error.JsonError;
        ejw.write(1) catch return error.JsonError;
        ejw.objectField("installed") catch return error.JsonError;
        ejw.beginObject() catch return error.JsonError;
        ejw.endObject() catch return error.JsonError;
        ejw.endObject() catch return error.JsonError;
        const empty_str = try arena_alloc.dupe(u8, empty_out.written());
        break :blk std.json.parseFromSliceLeaky(std.json.Value, arena_alloc, empty_str, .{}) catch return error.JsonError;
    };

    // 4. Check if already installed
    const installed_obj = blk: {
        if (lock_raw == .object) {
            if (lock_raw.object.get("installed")) |inst| switch (inst) {
                .object => |o| break :blk o,
                else => {},
            };
        }
        break :blk try std.json.ObjectMap.init(arena_alloc, &.{}, &.{});
    };

    const existing = installed_obj.get(name);
    if (existing != null and std.mem.eql(u8, on_conflict, "fail")) {
        output.exitWithError(gpa, mode, .{
            .code = 85,
            .err_type = "invalid_argument",
            .message = "Plugin already installed. Use --on-conflict replace or skip.",
            .recoverable = false,
            .suggestions = &.{
                "Retry with --on-conflict skip",
                "Retry with --on-conflict replace",
            },
        });
    }

    // 5. Count commands
    var installed_count: usize = 0;
    switch (commands_val) {
        .array => |arr| { installed_count = arr.items.len; },
        else => {},
    }

    // 6. Build plugin entry for lockfile
    var plugin_entry: std.json.ObjectMap = try std.json.ObjectMap.init(arena_alloc, &.{}, &.{});
    try plugin_entry.put(arena_alloc, "name", .{ .string = try arena_alloc.dupe(u8, name) });
    try plugin_entry.put(arena_alloc, "version", .{ .string = try arena_alloc.dupe(u8, version) });
    try plugin_entry.put(arena_alloc, "description", .{ .string = try arena_alloc.dupe(u8, description) });
    try plugin_entry.put(arena_alloc, "source", .{ .string = try arena_alloc.dupe(u8, source) });

    var resolved: std.json.ObjectMap = try std.json.ObjectMap.init(arena_alloc, &.{}, &.{});
    try resolved.put(arena_alloc, "type", .{ .string = "registry" });
    try resolved.put(arena_alloc, "manifest_path", .{ .string = try arena_alloc.dupe(u8, manifest_path) });
    try plugin_entry.put(arena_alloc, "resolved_from", .{ .object = resolved });

    const now_ms = std.Io.Timestamp.now(io, .real).toMilliseconds();
    var ts_buf: [32]u8 = undefined;
    const ts_str = try std.fmt.bufPrint(&ts_buf, "{d}", .{now_ms});
    try plugin_entry.put(arena_alloc, "installed_at", .{ .string = try arena_alloc.dupe(u8, ts_str) });

    // commands — copy from manifest, add plugin_name and plugin_dir
    var commands_list: std.json.Array = .init(arena_alloc);
    switch (commands_val) {
        .array => |arr| {
            for (arr.items) |cmd_val| switch (cmd_val) {
                .object => |cmd_obj| {
                    var cmd_copy: std.json.ObjectMap = try std.json.ObjectMap.init(arena_alloc, &.{}, &.{});
                    var iter = cmd_obj.iterator();
                    while (iter.next()) |e| {
                        try cmd_copy.put(arena_alloc, try arena_alloc.dupe(u8, e.key_ptr.*), e.value_ptr.*);
                    }
                    try cmd_copy.put(arena_alloc, "plugin_name", .{ .string = try arena_alloc.dupe(u8, name) });
                    const dir = std.fs.path.dirname(manifest_path) orelse ".";
                    try cmd_copy.put(arena_alloc, "plugin_dir", .{ .string = try arena_alloc.dupe(u8, dir) });
                    try commands_list.append(.{ .object = cmd_copy });
                },
                else => {},
            };
        },
        else => {},
    }
    try plugin_entry.put(arena_alloc, "commands", .{ .array = commands_list });

    if (manifest_obj.get("checks")) |checks_val| {
        try plugin_entry.put(arena_alloc, "checks", checks_val);
    }

    // 7. Write to lockfile
    if (std.mem.eql(u8, on_conflict, "skip") and existing != null) {
        // Skip — don't overwrite
    } else {
        try lockfile.upsertPluginEntry(arena_alloc, &lock_raw, name, .{ .object = plugin_entry });
    }

    try lockfile.writeLockRaw(io, gpa, home, lock_raw);

    // 8. Output
    if (mode == .human) {
        var buf: [256]u8 = undefined;
        const s = std.fmt.bufPrint(&buf, "  Installed {s} v{s} ({d} commands)\n", .{ name, version, installed_count }) catch "";
        output.writeRaw(s);
        return;
    }

    var out: std.Io.Writer.Allocating = .init(gpa);
    defer out.deinit();
    var jw: std.json.Stringify = .{ .writer = &out.writer };
    jw.beginObject() catch return;
    jw.objectField("ok") catch return;
    jw.write(true) catch return;
    jw.objectField("plugin") catch return;
    jw.write(name) catch return;
    jw.objectField("version") catch return;
    jw.write(version) catch return;
    jw.objectField("installed_commands") catch return;
    jw.write(installed_count) catch return;
    jw.endObject() catch return;
    output.writeRaw(out.written());
    output.writeRaw("\n");
}
