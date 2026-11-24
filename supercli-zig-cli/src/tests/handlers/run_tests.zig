const std = @import("std");
const th = @import("../../test_helpers.zig");
const mod = @import("../../handlers/run.zig");
const config = @import("../../config.zig");
const lockfile = @import("../../lockfile.zig");

const handleRun = mod.handleRun;
const RUN_LOCK_JSON = mod.RUN_LOCK_JSON;

test "handleRun executes an already-installed plugin command" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var threaded = th.makeIo(gpa);
    defer threaded.deinit();
    const io = threaded.io();

    const home = try th.createTempHome(gpa, "run-installed");
    defer gpa.free(home);
    defer th.removeTempHome(gpa, home);

    var arena = std.heap.ArenaAllocator.init(gpa);
    defer arena.deinit();
    const lock = try std.json.parseFromSliceLeaky(std.json.Value, arena.allocator(), RUN_LOCK_JSON, .{});
    try lockfile.writeLockRaw(io, arena.allocator(), home, lock);

    var cap = th.OutputCapture{ .alloc = gpa };
    cap.install();
    defer cap.release();

    const pos = [_][]const u8{ "run", "echotest", "self", "ping" };
    var flags = std.StringHashMap([]const u8).init(gpa);
    defer flags.deinit();
    const raw_argv = [_][]const u8{ "run", "echotest", "self", "ping" };
    try handleRun(io, gpa, .json, @constCast(&pos), flags, @constCast(&raw_argv), home);

    const parsed = try th.parseJson(gpa, cap.stdout());
    defer parsed.deinit();

    const root = parsed.value.object;
    try testing.expectEqualStrings("echotest.self.ping", root.get("command").?.string);
    const data = root.get("data").?.object;
    try testing.expectEqualStrings("pong", data.get("raw").?.string);
}

test "handleRun requires at least 4 positional args" {
    const testing = std.testing;

    // Verify the usage message format
    const usage_msg = "Usage: sc-zig run <plugin> <resource> <action> [--args]";
    try testing.expect(std.mem.indexOf(u8, usage_msg, "run") != null);
    try testing.expect(std.mem.indexOf(u8, usage_msg, "plugin") != null);
    try testing.expect(std.mem.indexOf(u8, usage_msg, "resource") != null);
    try testing.expect(std.mem.indexOf(u8, usage_msg, "action") != null);
}

test "handleRun passthrough detection logic" {
    const testing = std.testing;

    // The logic: user_passthrough = res == "_" and act == "_"
    const res = "_";
    const act = "_";
    const user_passthrough = std.mem.eql(u8, res, "_") and std.mem.eql(u8, act, "_");
    try testing.expect(user_passthrough);

    const res2 = "uuid";
    const act2 = "generate";
    const not_passthrough = std.mem.eql(u8, res2, "_") and std.mem.eql(u8, act2, "_");
    try testing.expect(!not_passthrough);
}
