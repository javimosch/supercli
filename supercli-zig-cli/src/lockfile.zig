// lockfile.zig — Raw read/write/mutate plugins.lock.json
// Works with std.json.Value to preserve all fields (checks, hooks, etc.)
const std = @import("std");

pub const LOCK_FILE = ".supercli/plugins/plugins.lock.json";

/// Read the raw lockfile JSON. Returns an owned json.Value (caller must deinit arena).
/// Returns an empty lock object if file doesn't exist.
pub fn readLockRaw(io: std.Io, gpa: std.mem.Allocator, home: []const u8) !std.json.Value {
    var arena = std.heap.ArenaAllocator.init(gpa);
    errdefer arena.deinit();
    const arena_alloc = arena.allocator();

    const lock_path = try std.fmt.allocPrint(arena_alloc, "{s}/{s}", .{ home, LOCK_FILE });

    const content = std.Io.Dir.cwd().readFileAlloc(io, lock_path, arena_alloc, .unlimited) catch {
        // Return empty lock structure
        var out: std.Io.Writer.Allocating = .init(arena_alloc);
        var jw: std.json.Stringify = .{ .writer = &out.writer };
        jw.beginObject() catch return error.JsonError;
        jw.objectField("version") catch return error.JsonError;
        jw.write(1) catch return error.JsonError;
        jw.objectField("installed") catch return error.JsonError;
        jw.beginObject() catch return error.JsonError;
        jw.endObject() catch return error.JsonError;
        jw.endObject() catch return error.JsonError;
        const empty_str = try arena_alloc.dupe(u8, out.written());
        const parsed = try std.json.parseFromSliceLeaky(std.json.Value, arena_alloc, empty_str, .{});
        return .{ .object = parsed.object };
    };

    const parsed = try std.json.parseFromSliceLeaky(std.json.Value, arena_alloc, content, .{});
    return parsed;
}

/// Write the raw lockfile JSON back to disk.
pub fn writeLockRaw(io: std.Io, gpa: std.mem.Allocator, home: []const u8, lock: std.json.Value) !void {
    const lock_path = try std.fmt.allocPrint(gpa, "{s}/{s}", .{ home, LOCK_FILE });

    // Ensure directory exists
    const dir_path = try std.fmt.allocPrint(gpa, "{s}/.supercli/plugins", .{home});
    defer gpa.free(dir_path);
    std.Io.Dir.createDirAbsolute(io, dir_path, .default_dir) catch |err| switch (err) {
        error.PathAlreadyExists => {},
        else => return err,
    };

    // Serialize JSON
    var out: std.Io.Writer.Allocating = .init(gpa);
    defer out.deinit();
    var jw: std.json.Stringify = .{
        .writer = &out.writer,
        .options = .{ .whitespace = .indent_2 },
    };
    try jw.write(lock);

    try std.Io.Dir.cwd().writeFile(io, .{ .sub_path = lock_path, .data = out.written() });
}

/// Get a plugin entry from the lockfile's installed map.
/// Returns null if not found.
pub fn getPluginEntry(lock: std.json.Value, name: []const u8) ?std.json.Value {
    const root = switch (lock) {
        .object => |o| o,
        else => return null,
    };
    const installed = root.get("installed") orelse return null;
    const installed_obj = switch (installed) {
        .object => |o| o,
        else => return null,
    };
    return installed_obj.get(name);
}

/// Remove a plugin from the lockfile's installed map.
/// Returns true if the plugin was found and removed, false if not found.
pub fn removePluginEntry(gpa: std.mem.Allocator, lock: *std.json.Value, name: []const u8) !bool {
    _ = gpa;
    switch (lock.*) {
        .object => |*root| {
            if (root.getPtr("installed")) |inst_ptr| {
                switch (inst_ptr.*) {
                    .object => |*installed_obj| {
                        if (!installed_obj.contains(name)) return false;
                        _ = installed_obj.swapRemove(name);
                        return true;
                    },
                    else => return false,
                }
            }
            return false;
        },
        else => return false,
    }
}

/// Add or replace a plugin entry in the lockfile's installed map.
pub fn upsertPluginEntry(gpa: std.mem.Allocator, lock: *std.json.Value, name: []const u8, entry: std.json.Value) !void {
    switch (lock.*) {
        .object => |*root| {
            // Get or create installed object
            if (root.getPtr("installed")) |inst_ptr| {
                switch (inst_ptr.*) {
                    .object => |*installed_obj| {
                        try installed_obj.put(gpa, name, entry);
                        return;
                    },
                    else => return error.InvalidLockFormat,
                }
            }
            // Create new installed object
            try root.put(gpa, "installed", .{ .object = try std.json.ObjectMap.init(gpa, &.{}, &.{}) });
            if (root.getPtr("installed")) |inst_ptr2| {
                switch (inst_ptr2.*) {
                    .object => |*installed_obj2| {
                        try installed_obj2.put(gpa, name, entry);
                        return;
                    },
                    else => return error.InvalidLockFormat,
                }
            }
            return error.InvalidLockFormat;
        },
        else => return error.InvalidLockFormat,
    }
}

/// Count installed plugins
pub fn countInstalled(lock: std.json.Value) usize {
    const root = switch (lock) {
        .object => |o| o,
        else => return 0,
    };
    const installed = root.get("installed") orelse return 0;
    return switch (installed) {
        .object => |o| o.count(),
        else => 0,
    };
}

/// List all installed plugin names (arena-allocated)
pub fn listInstalledNames(gpa: std.mem.Allocator, lock: std.json.Value) ![][]const u8 {
    var list: std.ArrayList([]const u8) = .empty;
    const root = switch (lock) {
        .object => |o| o,
        else => return list.toOwnedSlice(gpa),
    };
    const installed = root.get("installed") orelse return list.toOwnedSlice(gpa);
    const installed_obj = switch (installed) {
        .object => |o| o,
        else => return list.toOwnedSlice(gpa),
    };
    var iter = installed_obj.iterator();
    while (iter.next()) |entry| {
        try list.append(gpa, try gpa.dupe(u8, entry.key_ptr.*));
    }
    return list.toOwnedSlice(gpa);
}
