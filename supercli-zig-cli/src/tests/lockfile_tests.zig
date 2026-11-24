const std = @import("std");
const mod = @import("../lockfile.zig");

const LOCK_FILE = mod.LOCK_FILE;
const readLockRaw = mod.readLockRaw;
const writeLockRaw = mod.writeLockRaw;
const getPluginEntry = mod.getPluginEntry;
const removePluginEntry = mod.removePluginEntry;
const upsertPluginEntry = mod.upsertPluginEntry;
const countInstalled = mod.countInstalled;
const listInstalledNames = mod.listInstalledNames;

test "getPluginEntry returns entry for installed plugin" {
    const testing = std.testing;
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const gpa = arena.allocator();

    const json_str =
        \\{"version":1,"installed":{"uuid":{"version":"1.0.0","source":"npm"},"pg":{"version":"2.0.0"}}}
    ;
    const lock = try std.json.parseFromSliceLeaky(std.json.Value, gpa, json_str, .{});

    const entry = getPluginEntry(lock, "uuid");
    try testing.expect(entry != null);
    const obj = entry.?.object;
    try testing.expectEqualStrings("1.0.0", obj.get("version").?.string);

    const entry2 = getPluginEntry(lock, "pg");
    try testing.expect(entry2 != null);
    try testing.expectEqualStrings("2.0.0", entry2.?.object.get("version").?.string);
}

test "getPluginEntry returns null for missing plugin" {
    const testing = std.testing;
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const gpa = arena.allocator();

    const json_str =
        \\{"version":1,"installed":{"uuid":{"version":"1.0.0"}}}
    ;
    const lock = try std.json.parseFromSliceLeaky(std.json.Value, gpa, json_str, .{});

    try testing.expect(getPluginEntry(lock, "nonexistent") == null);
}

test "getPluginEntry returns null for non-object lock" {
    const testing = std.testing;

    const lock = std.json.Value{ .string = "not an object" };
    try testing.expect(getPluginEntry(lock, "uuid") == null);
}

test "getPluginEntry returns null when installed key missing" {
    const testing = std.testing;
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const gpa = arena.allocator();

    const json_str = \\{"version":1}
    ;
    const lock = try std.json.parseFromSliceLeaky(std.json.Value, gpa, json_str, .{});

    try testing.expect(getPluginEntry(lock, "uuid") == null);
}

test "countInstalled returns correct count" {
    const testing = std.testing;
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const gpa = arena.allocator();

    const json_str =
        \\{"version":1,"installed":{"uuid":{"version":"1.0.0"},"pg":{"version":"2.0.0"},"redis":{"version":"3.0.0"}}}
    ;
    const lock = try std.json.parseFromSliceLeaky(std.json.Value, gpa, json_str, .{});

    try testing.expectEqual(@as(usize, 3), countInstalled(lock));
}

test "countInstalled returns 0 for empty installed" {
    const testing = std.testing;
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const gpa = arena.allocator();

    const json_str = \\{"version":1,"installed":{}}
    ;
    const lock = try std.json.parseFromSliceLeaky(std.json.Value, gpa, json_str, .{});

    try testing.expectEqual(@as(usize, 0), countInstalled(lock));
}

test "countInstalled returns 0 for non-object lock" {
    const testing = std.testing;

    const lock = std.json.Value{ .integer = 42 };
    try testing.expectEqual(@as(usize, 0), countInstalled(lock));
}

test "countInstalled returns 0 when installed key missing" {
    const testing = std.testing;
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const gpa = arena.allocator();

    const json_str = \\{"version":1}
    ;
    const lock = try std.json.parseFromSliceLeaky(std.json.Value, gpa, json_str, .{});

    try testing.expectEqual(@as(usize, 0), countInstalled(lock));
}

test "removePluginEntry removes existing plugin" {
    const testing = std.testing;
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const gpa = arena.allocator();

    const json_str =
        \\{"version":1,"installed":{"uuid":{"version":"1.0.0"},"pg":{"version":"2.0.0"}}}
    ;
    var lock = try std.json.parseFromSliceLeaky(std.json.Value, gpa, json_str, .{});

    const removed = try removePluginEntry(gpa, &lock, "uuid");
    try testing.expect(removed);
    try testing.expectEqual(@as(usize, 1), countInstalled(lock));
    try testing.expect(getPluginEntry(lock, "uuid") == null);
    try testing.expect(getPluginEntry(lock, "pg") != null);
}

test "removePluginEntry returns false for missing plugin" {
    const testing = std.testing;
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const gpa = arena.allocator();

    const json_str =
        \\{"version":1,"installed":{"uuid":{"version":"1.0.0"}}}
    ;
    var lock = try std.json.parseFromSliceLeaky(std.json.Value, gpa, json_str, .{});

    const removed = try removePluginEntry(gpa, &lock, "nonexistent");
    try testing.expect(!removed);
    try testing.expectEqual(@as(usize, 1), countInstalled(lock));
}

test "removePluginEntry returns false for non-object lock" {
    const testing = std.testing;
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const gpa = arena.allocator();

    var lock = std.json.Value{ .string = "not an object" };
    const removed = try removePluginEntry(gpa, &lock, "uuid");
    try testing.expect(!removed);
}

test "upsertPluginEntry adds new plugin" {
    const testing = std.testing;
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const gpa = arena.allocator();

    const json_str =
        \\{"version":1,"installed":{"uuid":{"version":"1.0.0"}}}
    ;
    var lock = try std.json.parseFromSliceLeaky(std.json.Value, gpa, json_str, .{});

    const new_entry = std.json.Value{ .object = try std.json.ObjectMap.init(gpa, &.{
        "version", "source",
    }, &.{
        .{ .string = "2.0.0" }, .{ .string = "npm" },
    }) };

    try upsertPluginEntry(gpa, &lock, "pg", new_entry);

    try testing.expectEqual(@as(usize, 2), countInstalled(lock));
    const entry = getPluginEntry(lock, "pg");
    try testing.expect(entry != null);
    try testing.expectEqualStrings("2.0.0", entry.?.object.get("version").?.string);
}

test "upsertPluginEntry replaces existing plugin" {
    const testing = std.testing;
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const gpa = arena.allocator();

    const json_str =
        \\{"version":1,"installed":{"uuid":{"version":"1.0.0","source":"npm"}}}
    ;
    var lock = try std.json.parseFromSliceLeaky(std.json.Value, gpa, json_str, .{});

    const replacement = std.json.Value{ .object = try std.json.ObjectMap.init(gpa, &.{
        "version",
    }, &.{
        .{ .string = "2.0.0" },
    }) };

    try upsertPluginEntry(gpa, &lock, "uuid", replacement);

    try testing.expectEqual(@as(usize, 1), countInstalled(lock));
    const entry = getPluginEntry(lock, "uuid");
    try testing.expect(entry != null);
    try testing.expectEqualStrings("2.0.0", entry.?.object.get("version").?.string);
    // Old "source" field should be gone (replaced, not merged)
    try testing.expect(entry.?.object.get("source") == null);
}

test "upsertPluginEntry returns error for non-object lock" {
    const testing = std.testing;
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const gpa = arena.allocator();

    var lock = std.json.Value{ .string = "not an object" };
    const entry = std.json.Value{ .object = try std.json.ObjectMap.init(gpa, &.{}, &.{}) };

    try testing.expectError(error.InvalidLockFormat, upsertPluginEntry(gpa, &lock, "uuid", entry));
}

test "listInstalledNames returns all plugin names" {
    const testing = std.testing;
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const gpa = arena.allocator();

    const json_str =
        \\{"version":1,"installed":{"uuid":{"version":"1.0.0"},"pg":{"version":"2.0.0"},"redis":{"version":"3.0.0"}}}
    ;
    const lock = try std.json.parseFromSliceLeaky(std.json.Value, gpa, json_str, .{});

    const names = try listInstalledNames(gpa, lock);
    // Order is not guaranteed (ObjectMap), so just check count and membership
    try testing.expectEqual(@as(usize, 3), names.len);

    var found_uuid = false;
    var found_pg = false;
    var found_redis = false;
    for (names) |n| {
        if (std.mem.eql(u8, n, "uuid")) found_uuid = true;
        if (std.mem.eql(u8, n, "pg")) found_pg = true;
        if (std.mem.eql(u8, n, "redis")) found_redis = true;
    }
    try testing.expect(found_uuid);
    try testing.expect(found_pg);
    try testing.expect(found_redis);
}

test "listInstalledNames returns empty for non-object lock" {
    const testing = std.testing;
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const gpa = arena.allocator();

    const lock = std.json.Value{ .integer = 42 };
    const names = try listInstalledNames(gpa, lock);
    try testing.expectEqual(@as(usize, 0), names.len);
}

test "readLockRaw returns empty lock for nonexistent file" {
    const testing = std.testing;
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const gpa = arena.allocator();

    var threaded = std.Io.Threaded.init(gpa, .{});
    defer threaded.deinit();
    const io = threaded.io();

    // Use a path that definitely doesn't have a lock file
    const home = "/tmp/sc-zig-test-lockfile-nonexistent-12345";

    const lock = try readLockRaw(io, gpa, home);
    // Should return an empty lock object with version and installed
    try testing.expectEqual(@as(usize, 0), countInstalled(lock));
}

test "writeLockRaw and readLockRaw roundtrip" {
    const testing = std.testing;
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const gpa = arena.allocator();

    var threaded = std.Io.Threaded.init(gpa, .{});
    defer threaded.deinit();
    const io = threaded.io();

    // Use a unique temp directory
    const home = "/tmp/sc-zig-test-lockfile-rt";

    // Create parent directories (writeLockRaw only creates the last level)
    std.Io.Dir.createDirAbsolute(io, "/tmp/sc-zig-test-lockfile-rt", .default_dir) catch |err| switch (err) {
        error.PathAlreadyExists => {},
        else => {},
    };
    std.Io.Dir.createDirAbsolute(io, "/tmp/sc-zig-test-lockfile-rt/.supercli", .default_dir) catch |err| switch (err) {
        error.PathAlreadyExists => {},
        else => {},
    };

    // Create the lock JSON
    const json_str =
        \\{"version":1,"installed":{"test-plugin":{"version":"1.0.0","source":"test"}}}
    ;
    const lock = try std.json.parseFromSliceLeaky(std.json.Value, gpa, json_str, .{});

    // Write it
    try writeLockRaw(io, gpa, home, lock);

    // Read it back
    const read_lock = try readLockRaw(io, gpa, home);

    // Verify content
    try testing.expectEqual(@as(usize, 1), countInstalled(read_lock));
    const entry = getPluginEntry(read_lock, "test-plugin");
    try testing.expect(entry != null);
    try testing.expectEqualStrings("1.0.0", entry.?.object.get("version").?.string);
    try testing.expectEqualStrings("test", entry.?.object.get("source").?.string);

    // Cleanup: remove the lock file
    std.Io.Dir.deleteFileAbsolute(io, "/tmp/sc-zig-test-lockfile-rt/.supercli/plugins/plugins.lock.json") catch {};
}
