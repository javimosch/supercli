const std = @import("std");
const th = @import("../../test_helpers.zig");
const mod = @import("../../handlers/plugins.zig");
const config = @import("../../config.zig");
const lockfile = @import("../../lockfile.zig");

const bundledPluginsDir = mod.bundledPluginsDir;
const handlePluginsList = mod.handlePluginsList;
const handlePluginsUpdate = mod.handlePluginsUpdate;
const handlePluginsExplore = mod.handlePluginsExplore;
const handlePluginsRemove = mod.handlePluginsRemove;
const handlePluginsShow = mod.handlePluginsShow;

pub fn writeLockWithMeta(alloc: std.mem.Allocator, io: std.Io, home: []const u8) !void {
    const json_str =
        \\{"version":1,"installed":{
        \\  "uuid-cli":{"name":"uuid-cli","version":"1.0.0","description":"UUID generator","source":"","commands":[{"namespace":"uuid","resource":"self","action":"generate","description":"Generate UUID","adapter":"process","args":[]}]},
        \\  "http-cli":{"name":"http-cli","version":"2.0.0","description":"HTTP client","source":"","commands":[{"namespace":"http","resource":"check","action":"health","description":"Health check","adapter":"process","args":[]}]}
        \\}}
    ;
    var arena = std.heap.ArenaAllocator.init(alloc);
    defer arena.deinit();
    const gpa = arena.allocator();
    const lock = try std.json.parseFromSliceLeaky(std.json.Value, gpa, json_str, .{});
    try lockfile.writeLockRaw(io, gpa, home, lock);
}







test "handlePluginsList JSON output structure with plugins" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var threaded = th.makeIo(gpa);
    defer threaded.deinit();
    const io = threaded.io();

    const home = try th.createTempHome(gpa, "plugins-list");
    defer gpa.free(home);
    defer th.removeTempHome(gpa, home);

    try writeLockWithMeta(gpa, io, home);
    var lock = try config.readLock(io, home, gpa);
    defer lock.deinit();

    // Sanity: confirm readLock populated the plugins.
    try testing.expectEqual(@as(usize, 2), lock.plugins.len);
    try testing.expectEqualStrings("1.0.0", lock.plugins[0].version);

    var cap = th.OutputCapture{ .alloc = gpa };
    cap.install();
    defer cap.release();

    handlePluginsList(gpa, &lock, .json);

    const parsed = try th.parseJson(gpa, cap.stdout());
    defer parsed.deinit();

    const root = parsed.value.object;
    try testing.expectEqualStrings("1.0", root.get("version").?.string);
    try testing.expectEqual(@as(i64, 2), root.get("total").?.integer);

    const plugins = root.get("plugins").?.array;
    try testing.expectEqual(@as(usize, 2), plugins.items.len);
    try testing.expectEqualStrings("uuid-cli", plugins.items[0].object.get("name").?.string);
    try testing.expectEqualStrings("1.0.0", plugins.items[0].object.get("version").?.string);
    try testing.expectEqual(@as(i64, 1), plugins.items[0].object.get("commands").?.integer);
}

test "handlePluginsList JSON output structure with empty lock" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var lock = try th.buildLock(gpa, &.{});
    defer lock.deinit();

    var cap = th.OutputCapture{ .alloc = gpa };
    cap.install();
    defer cap.release();

    handlePluginsList(gpa, &lock, .json);

    const parsed = try th.parseJson(gpa, cap.stdout());
    defer parsed.deinit();

    const root = parsed.value.object;
    try testing.expectEqual(@as(i64, 0), root.get("total").?.integer);
    try testing.expectEqual(@as(usize, 0), root.get("plugins").?.array.items.len);
}

test "handlePluginsList human mode lists plugin names" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var threaded = th.makeIo(gpa);
    defer threaded.deinit();
    const io = threaded.io();

    const home = try th.createTempHome(gpa, "plugins-list-human");
    defer gpa.free(home);
    defer th.removeTempHome(gpa, home);

    try writeLockWithMeta(gpa, io, home);
    var lock = try config.readLock(io, home, gpa);
    defer lock.deinit();

    var cap = th.OutputCapture{ .alloc = gpa };
    cap.install();
    defer cap.release();

    handlePluginsList(gpa, &lock, .human);

    try testing.expect(std.mem.indexOf(u8, cap.stdout(), "uuid-cli") != null);
    try testing.expect(std.mem.indexOf(u8, cap.stdout(), "http-cli") != null);
    try testing.expect(std.mem.indexOf(u8, cap.stdout(), "Installed Plugins") != null);
}

test "handlePluginsShow JSON output structure" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var threaded = th.makeIo(gpa);
    defer threaded.deinit();
    const io = threaded.io();

    const home = try th.createTempHome(gpa, "plugins-show");
    defer gpa.free(home);
    defer th.removeTempHome(gpa, home);

    try writeLockWithMeta(gpa, io, home);

    var cap = th.OutputCapture{ .alloc = gpa };
    cap.install();
    defer cap.release();

    try handlePluginsShow(io, gpa, .json, "uuid-cli", home);

    const parsed = try th.parseJson(gpa, cap.stdout());
    defer parsed.deinit();

    const plugin = parsed.value.object.get("plugin").?.object;
    try testing.expectEqualStrings("uuid-cli", plugin.get("name").?.string);
    try testing.expectEqualStrings("1.0.0", plugin.get("version").?.string);
}

test "handlePluginsExplore empty results JSON structure" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var threaded = th.makeIo(gpa);
    defer threaded.deinit();
    const io = threaded.io();

    const home = try th.createTempHome(gpa, "plugins-explore-empty");
    defer gpa.free(home);
    defer th.removeTempHome(gpa, home);

    var flags = std.StringHashMap([]const u8).init(gpa);
    defer flags.deinit();
    try flags.put("name", "nonexistent");

    var cap = th.OutputCapture{ .alloc = gpa };
    cap.install();
    defer cap.release();

    try handlePluginsExplore(io, gpa, .json, flags, home);

    const parsed = try th.parseJson(gpa, cap.stdout());
    defer parsed.deinit();

    const root = parsed.value.object;
    try testing.expectEqual(@as(i64, 0), root.get("total").?.integer);
    try testing.expectEqual(@as(usize, 0), root.get("plugins").?.array.items.len);
    try testing.expectEqualStrings("nonexistent", root.get("filters").?.object.get("name").?.string);
}

test "handlePluginsExplore with no filters returns all bundled plugins" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var threaded = th.makeIo(gpa);
    defer threaded.deinit();
    const io = threaded.io();

    const home = try th.createTempHome(gpa, "plugins-explore-all");
    defer gpa.free(home);
    defer th.removeTempHome(gpa, home);

    var flags = std.StringHashMap([]const u8).init(gpa);
    defer flags.deinit();

    var cap = th.OutputCapture{ .alloc = gpa };
    cap.install();
    defer cap.release();

    try handlePluginsExplore(io, gpa, .json, flags, home);

    const parsed = try th.parseJson(gpa, cap.stdout());
    defer parsed.deinit();

    const root = parsed.value.object;
    // Empty bundled dir → 0 plugins, but valid envelope with version.
    try testing.expectEqualStrings("1.0", root.get("version").?.string);
    try testing.expectEqual(@as(i64, 0), root.get("total").?.integer);
}
