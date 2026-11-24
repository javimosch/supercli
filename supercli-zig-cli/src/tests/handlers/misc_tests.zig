const std = @import("std");
const th = @import("../../test_helpers.zig");
const mod = @import("../../handlers/misc.zig");
const config = @import("../../config.zig");

const handleConfigShow = mod.handleConfigShow;
const handlePlan = mod.handlePlan;
const writeConfigLock = mod.writeConfigLock;

test "handleConfigShow JSON output structure" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var threaded = th.makeIo(gpa);
    defer threaded.deinit();
    const io = threaded.io();

    const home = try th.createTempHome(gpa, "config-show");
    defer gpa.free(home);
    defer th.removeTempHome(gpa, home);

    try writeConfigLock(gpa, io, home);

    var cap = th.OutputCapture{ .alloc = gpa };
    cap.install();
    defer cap.release();

    try handleConfigShow(io, gpa, .json, home);

    const parsed = try th.parseJson(gpa, cap.stdout());
    defer parsed.deinit();

    const root = parsed.value.object;
    // lockfile path is <home>/.supercli/plugins/plugins.lock.json
    try testing.expect(std.mem.endsWith(u8, root.get("lockfile").?.string, "plugins.lock.json"));
    try testing.expectEqual(@as(i64, 2), root.get("plugins").?.integer);
    try testing.expectEqual(@as(i64, 2), root.get("commands").?.integer);
}

test "handleConfigShow human mode outputs summary" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var threaded = th.makeIo(gpa);
    defer threaded.deinit();
    const io = threaded.io();

    const home = try th.createTempHome(gpa, "config-show-human");
    defer gpa.free(home);
    defer th.removeTempHome(gpa, home);

    try writeConfigLock(gpa, io, home);

    var cap = th.OutputCapture{ .alloc = gpa };
    cap.install();
    defer cap.release();

    try handleConfigShow(io, gpa, .human, home);

    try testing.expect(std.mem.indexOf(u8, cap.stdout(), "SuperCLI Config") != null);
    try testing.expect(std.mem.indexOf(u8, cap.stdout(), "Plugins:") != null);
    try testing.expect(std.mem.indexOf(u8, cap.stdout(), "Commands:") != null);
}

test "handlePlan JSON output structure" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var threaded = th.makeIo(gpa);
    defer threaded.deinit();
    const io = threaded.io();

    const home = try th.createTempHome(gpa, "plan-args");
    defer gpa.free(home);
    defer th.removeTempHome(gpa, home);

    try writeConfigLock(gpa, io, home);

    var cap = th.OutputCapture{ .alloc = gpa };
    cap.install();
    defer cap.release();

    const pos = [_][]const u8{ "plan", "uuid", "self", "generate" };
    try handlePlan(io, gpa, .json, @constCast(&pos), home);

    const parsed = try th.parseJson(gpa, cap.stdout());
    defer parsed.deinit();

    const root = parsed.value.object;
    try testing.expectEqualStrings("plan", root.get("mode").?.string);
    try testing.expectEqualStrings("uuid.self.generate", root.get("command").?.string);
    try testing.expectEqualStrings("process", root.get("adapter").?.string);
    try testing.expectEqualStrings("Generate a UUID v4", root.get("description").?.string);
    try testing.expectEqual(true, root.get("dry_run").?.bool);
    const args = root.get("args").?.array;
    try testing.expectEqual(@as(usize, 1), args.items.len);
    try testing.expectEqualStrings("version", args.items[0].object.get("name").?.string);
    try testing.expectEqualStrings("string", args.items[0].object.get("type").?.string);
}

test "handlePlan JSON output with no args" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var threaded = th.makeIo(gpa);
    defer threaded.deinit();
    const io = threaded.io();

    const home = try th.createTempHome(gpa, "plan-noargs");
    defer gpa.free(home);
    defer th.removeTempHome(gpa, home);

    try writeConfigLock(gpa, io, home);

    var cap = th.OutputCapture{ .alloc = gpa };
    cap.install();
    defer cap.release();

    const pos = [_][]const u8{ "plan", "http", "check", "health" };
    try handlePlan(io, gpa, .json, @constCast(&pos), home);

    const parsed = try th.parseJson(gpa, cap.stdout());
    defer parsed.deinit();

    const root = parsed.value.object;
    try testing.expectEqualStrings("http.check.health", root.get("command").?.string);
    try testing.expectEqual(@as(usize, 0), root.get("args").?.array.items.len);
    try testing.expectEqual(true, root.get("dry_run").?.bool);
}

test "handlePlan human mode outputs command header" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var threaded = th.makeIo(gpa);
    defer threaded.deinit();
    const io = threaded.io();

    const home = try th.createTempHome(gpa, "plan-human");
    defer gpa.free(home);
    defer th.removeTempHome(gpa, home);

    try writeConfigLock(gpa, io, home);

    var cap = th.OutputCapture{ .alloc = gpa };
    cap.install();
    defer cap.release();

    const pos = [_][]const u8{ "plan", "uuid", "self", "generate" };
    try handlePlan(io, gpa, .human, @constCast(&pos), home);

    try testing.expect(std.mem.indexOf(u8, cap.stdout(), "Execution Plan") != null);
    try testing.expect(std.mem.indexOf(u8, cap.stdout(), "uuid self generate") != null);
    try testing.expect(std.mem.indexOf(u8, cap.stdout(), "dry-run") != null);
}
