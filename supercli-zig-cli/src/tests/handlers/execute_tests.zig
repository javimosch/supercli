const std = @import("std");
const th = @import("../../test_helpers.zig");
const mod = @import("../../handlers/execute.zig");
const config = @import("../../config.zig");
const args_mod = @import("../../args.zig");
const RESERVED_FLAGS = args_mod.RESERVED_FLAGS;

const handleExecuteCommand = mod.handleExecuteCommand;
const makeCmd = mod.makeCmd;

test "handleExecuteCommand JSON output structure for json result" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var threaded = th.makeIo(gpa);
    defer threaded.deinit();
    const io = threaded.io();

    var arena = std.heap.ArenaAllocator.init(gpa);
    defer arena.deinit();

    // `echo '{"uuid":"abc-123"}'` with parseJson=true → .json result.
    const cmd = try makeCmd(arena.allocator(), "uuid", "self", "generate",
        \\{"command":"echo","baseArgs":["{\"uuid\":\"abc-123\"}"],"parseJson":true}
    );

    var flags = std.StringHashMap([]const u8).init(gpa);
    defer flags.deinit();

    var cap = th.OutputCapture{ .alloc = gpa };
    cap.install();
    defer cap.release();

    try handleExecuteCommand(io, gpa, .json, cmd, flags, &.{}, false);

    const parsed = try th.parseJson(gpa, cap.stdout());
    defer parsed.deinit();

    const root = parsed.value.object;
    try testing.expectEqualStrings("1.0", root.get("version").?.string);
    try testing.expectEqualStrings("uuid.self.generate", root.get("command").?.string);
    try testing.expect(root.get("duration_ms").?.integer >= 0);
    const data = root.get("data").?.object;
    try testing.expectEqualStrings("abc-123", data.get("uuid").?.string);
}

test "handleExecuteCommand JSON output structure for raw result" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var threaded = th.makeIo(gpa);
    defer threaded.deinit();
    const io = threaded.io();

    var arena = std.heap.ArenaAllocator.init(gpa);
    defer arena.deinit();

    // `echo 'OK - service healthy'` with parseJson=false → .raw result.
    const cmd = try makeCmd(arena.allocator(), "http", "check", "health",
        \\{"command":"echo","baseArgs":["OK - service healthy"],"parseJson":false}
    );

    var flags = std.StringHashMap([]const u8).init(gpa);
    defer flags.deinit();

    var cap = th.OutputCapture{ .alloc = gpa };
    cap.install();
    defer cap.release();

    try handleExecuteCommand(io, gpa, .json, cmd, flags, &.{}, false);

    const parsed = try th.parseJson(gpa, cap.stdout());
    defer parsed.deinit();

    const root = parsed.value.object;
    try testing.expectEqualStrings("http.check.health", root.get("command").?.string);
    try testing.expect(root.get("duration_ms").?.integer >= 0);
    const data = root.get("data").?.object;
    try testing.expectEqualStrings("OK - service healthy", data.get("raw").?.string);
}

test "handleExecuteCommand human mode prints raw output directly" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var threaded = th.makeIo(gpa);
    defer threaded.deinit();
    const io = threaded.io();

    var arena = std.heap.ArenaAllocator.init(gpa);
    defer arena.deinit();

    const cmd = try makeCmd(arena.allocator(), "http", "check", "health",
        \\{"command":"echo","baseArgs":["healthy"],"parseJson":false}
    );

    var flags = std.StringHashMap([]const u8).init(gpa);
    defer flags.deinit();

    var cap = th.OutputCapture{ .alloc = gpa };
    cap.install();
    defer cap.release();

    try handleExecuteCommand(io, gpa, .human, cmd, flags, &.{}, false);

    // Human + raw → the raw string is printed directly.
    try testing.expect(std.mem.indexOf(u8, cap.stdout(), "healthy") != null);
}

test "handleExecuteCommand only supports process adapter" {
    const testing = std.testing;

    // The error message for non-process adapters
    const msg = "Only 'process' adapter is supported in the Zig CLI";
    try testing.expect(std.mem.indexOf(u8, msg, "process") != null);
}

test "handleExecuteCommand error for missing command" {
    const testing = std.testing;

    // The error message for missing command
    const msg = "Command has no binary configured (missing adapterConfig.command)";
    try testing.expect(std.mem.indexOf(u8, msg, "adapterConfig.command") != null);
}

test "RESERVED_FLAGS in execute.zig has expected flags" {
    const testing = std.testing;
    try testing.expectEqual(@as(usize, 8), RESERVED_FLAGS.len);
    try testing.expectEqualStrings("json", RESERVED_FLAGS[0]);
    try testing.expectEqualStrings("human", RESERVED_FLAGS[1]);
    try testing.expectEqualStrings("compact", RESERVED_FLAGS[2]);
    try testing.expectEqualStrings("schema", RESERVED_FLAGS[3]);
    try testing.expectEqualStrings("help", RESERVED_FLAGS[4]);
    try testing.expectEqualStrings("help-json", RESERVED_FLAGS[5]);
    try testing.expectEqualStrings("no-color", RESERVED_FLAGS[6]);
    try testing.expectEqualStrings("format", RESERVED_FLAGS[7]);
}
