const std = @import("std");
const th = @import("../../test_helpers.zig");
const mod = @import("../../handlers/install.zig");
const config = @import("../../config.zig");

const handlePluginsInstallNative = mod.handlePluginsInstallNative;
const THREE_CMD_MANIFEST = mod.THREE_CMD_MANIFEST;
const ZERO_CMD_MANIFEST = mod.ZERO_CMD_MANIFEST;

test "handlePluginsInstallNative JSON output structure" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var threaded = th.makeIo(gpa);
    defer threaded.deinit();
    const io = threaded.io();

    const home = try th.createTempHome(gpa, "install-3cmd");
    defer gpa.free(home);
    defer th.removeTempHome(gpa, home);

    try th.writeBundledPlugin(gpa, io, home, "test-plugin", THREE_CMD_MANIFEST);

    var cap = th.OutputCapture{ .alloc = gpa };
    cap.install();
    defer cap.release();

    try handlePluginsInstallNative(io, gpa, .json, "test-plugin", home, "skip");

    const parsed = try th.parseJson(gpa, cap.stdout());
    defer parsed.deinit();

    const root = parsed.value.object;
    try testing.expectEqual(true, root.get("ok").?.bool);
    try testing.expectEqualStrings("test-plugin", root.get("plugin").?.string);
    try testing.expectEqualStrings("1.0.0", root.get("version").?.string);
    try testing.expectEqual(@as(i64, 3), root.get("installed_commands").?.integer);

    // Verify the plugin was actually written to the lockfile.
    var lock = try config.readLock(io, home, gpa);
    defer lock.deinit();
    try testing.expectEqual(@as(usize, 1), lock.plugins.len);
    try testing.expectEqualStrings("test-plugin", lock.plugins[0].name);
}

test "handlePluginsInstallNative JSON output with zero commands" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var threaded = th.makeIo(gpa);
    defer threaded.deinit();
    const io = threaded.io();

    const home = try th.createTempHome(gpa, "install-0cmd");
    defer gpa.free(home);
    defer th.removeTempHome(gpa, home);

    try th.writeBundledPlugin(gpa, io, home, "empty-plugin", ZERO_CMD_MANIFEST);

    var cap = th.OutputCapture{ .alloc = gpa };
    cap.install();
    defer cap.release();

    try handlePluginsInstallNative(io, gpa, .json, "empty-plugin", home, "skip");

    const parsed = try th.parseJson(gpa, cap.stdout());
    defer parsed.deinit();

    const root = parsed.value.object;
    try testing.expectEqual(true, root.get("ok").?.bool);
    try testing.expectEqualStrings("empty-plugin", root.get("plugin").?.string);
    try testing.expectEqual(@as(i64, 0), root.get("installed_commands").?.integer);
}
