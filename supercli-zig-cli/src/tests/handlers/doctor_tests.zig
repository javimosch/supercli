const std = @import("std");
const th = @import("../../test_helpers.zig");
const mod = @import("../../handlers/doctor.zig");
const config = @import("../../config.zig");
const lockfile = @import("../../lockfile.zig");

const handlePluginsDoctor = mod.handlePluginsDoctor;
const writeDoctorLock = mod.writeDoctorLock;
const twoPluginLockJson = mod.twoPluginLockJson;

test "doctorOne JSON output with passing check" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var threaded = th.makeIo(gpa);
    defer threaded.deinit();
    const io = threaded.io();

    const home = try th.createTempHome(gpa, "doctor-ok");
    defer gpa.free(home);
    defer th.removeTempHome(gpa, home);

    // `true` always exits 0 → ok=true.
    try writeDoctorLock(gpa, io, home, "[{\"type\":\"binary\",\"name\":\"true\"}]");

    var cap = th.OutputCapture{ .alloc = gpa };
    cap.install();
    defer cap.release();

    const pos = [_][]const u8{ "plugins", "doctor", "test-plugin" };
    try handlePluginsDoctor(io, gpa, .json, @constCast(&pos), home);

    const parsed = try th.parseJson(gpa, cap.stdout());
    defer parsed.deinit();

    const root = parsed.value.object;
    try testing.expectEqualStrings("test-plugin", root.get("plugin").?.string);
    try testing.expectEqual(true, root.get("ok").?.bool);
    const checks = root.get("checks").?.array;
    try testing.expectEqual(@as(usize, 1), checks.items.len);
    const c0 = checks.items[0].object;
    try testing.expectEqualStrings("binary", c0.get("type").?.string);
    try testing.expectEqualStrings("true", c0.get("binary").?.string);
    try testing.expectEqual(true, c0.get("ok").?.bool);
}

test "doctorOne JSON output with failing check" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var threaded = th.makeIo(gpa);
    defer threaded.deinit();
    const io = threaded.io();

    const home = try th.createTempHome(gpa, "doctor-fail");
    defer gpa.free(home);
    defer th.removeTempHome(gpa, home);

    // Nonexistent binary → ok=false, message "not installed".
    try writeDoctorLock(gpa, io, home, "[{\"type\":\"binary\",\"name\":\"nonexistent-binary-xyz-123\"}]");

    var cap = th.OutputCapture{ .alloc = gpa };
    cap.install();
    defer cap.release();

    const pos = [_][]const u8{ "plugins", "doctor", "test-plugin" };
    try handlePluginsDoctor(io, gpa, .json, @constCast(&pos), home);

    const parsed = try th.parseJson(gpa, cap.stdout());
    defer parsed.deinit();

    const root = parsed.value.object;
    try testing.expectEqual(false, root.get("ok").?.bool);
    const checks = root.get("checks").?.array;
    try testing.expectEqual(@as(usize, 1), checks.items.len);
    try testing.expectEqual(false, checks.items[0].object.get("ok").?.bool);
    try testing.expectEqualStrings("not installed", checks.items[0].object.get("message").?.string);
}

test "doctorOne with no checks reports ok and empty checks array" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var threaded = th.makeIo(gpa);
    defer threaded.deinit();
    const io = threaded.io();

    const home = try th.createTempHome(gpa, "doctor-nochecks");
    defer gpa.free(home);
    defer th.removeTempHome(gpa, home);

    try writeDoctorLock(gpa, io, home, "[]");

    var cap = th.OutputCapture{ .alloc = gpa };
    cap.install();
    defer cap.release();

    const pos = [_][]const u8{ "plugins", "doctor", "test-plugin" };
    try handlePluginsDoctor(io, gpa, .json, @constCast(&pos), home);

    const parsed = try th.parseJson(gpa, cap.stdout());
    defer parsed.deinit();

    const root = parsed.value.object;
    try testing.expectEqual(true, root.get("ok").?.bool);
    try testing.expectEqual(@as(usize, 0), root.get("checks").?.array.items.len);
}

test "doctorAll JSON output structure" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var threaded = th.makeIo(gpa);
    defer threaded.deinit();
    const io = threaded.io();

    const home = try th.createTempHome(gpa, "doctor-all");
    defer gpa.free(home);
    defer th.removeTempHome(gpa, home);

    var arena = std.heap.ArenaAllocator.init(gpa);
    defer arena.deinit();
    const lock = try std.json.parseFromSliceLeaky(std.json.Value, arena.allocator(), twoPluginLockJson(), .{});
    try lockfile.writeLockRaw(io, arena.allocator(), home, lock);

    var cap = th.OutputCapture{ .alloc = gpa };
    cap.install();
    defer cap.release();

    const pos = [_][]const u8{ "plugins", "doctor" };
    try handlePluginsDoctor(io, gpa, .json, @constCast(&pos), home);

    const parsed = try th.parseJson(gpa, cap.stdout());
    defer parsed.deinit();

    const root = parsed.value.object;
    try testing.expectEqual(@as(i64, 2), root.get("total_plugins").?.integer);
    const plugins = root.get("plugins").?.array;
    try testing.expectEqual(@as(usize, 2), plugins.items.len);
    try testing.expectEqualStrings("uuid-cli", plugins.items[0].object.get("name").?.string);
    try testing.expectEqual(@as(i64, 1), plugins.items[0].object.get("commands").?.integer);
    try testing.expectEqual(@as(i64, 3), plugins.items[1].object.get("commands").?.integer);
}

test "doctorAll JSON output with no plugins" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var threaded = th.makeIo(gpa);
    defer threaded.deinit();
    const io = threaded.io();

    const home = try th.createTempHome(gpa, "doctor-empty");
    defer gpa.free(home);
    defer th.removeTempHome(gpa, home);

    var cap = th.OutputCapture{ .alloc = gpa };
    cap.install();
    defer cap.release();

    const pos = [_][]const u8{ "plugins", "doctor" };
    try handlePluginsDoctor(io, gpa, .json, @constCast(&pos), home);

    const parsed = try th.parseJson(gpa, cap.stdout());
    defer parsed.deinit();

    const root = parsed.value.object;
    try testing.expectEqual(@as(i64, 0), root.get("total_plugins").?.integer);
    try testing.expectEqual(@as(usize, 0), root.get("plugins").?.array.items.len);
}
