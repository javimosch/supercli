const std = @import("std");
const th = @import("../../test_helpers.zig");
const mod = @import("../../handlers/commands.zig");
const config = @import("../../config.zig");

const handleCommands = mod.handleCommands;
const handleInspect = mod.handleInspect;
const buildTwoCmdLock = mod.buildTwoCmdLock;

test "handleCommands JSON output structure with commands" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var lock = try buildTwoCmdLock(gpa);
    defer lock.deinit();

    var flags = std.StringHashMap([]const u8).init(gpa);
    defer flags.deinit();

    var cap = th.OutputCapture{ .alloc = gpa };
    cap.install();
    defer cap.release();

    try handleCommands(gpa, &lock, .json, flags);

    const parsed = try th.parseJson(gpa, cap.stdout());
    defer parsed.deinit();

    const root = parsed.value.object;
    try testing.expectEqualStrings("1.0", root.get("version").?.string);
    try testing.expectEqual(@as(i64, 2), root.get("total").?.integer);
    try testing.expectEqual(@as(i64, 2), root.get("returned").?.integer);
    try testing.expectEqual(@as(i64, 0), root.get("offset").?.integer);

    const cmds = root.get("commands").?.array;
    try testing.expectEqual(@as(usize, 2), cmds.items.len);

    const cmd0 = cmds.items[0].object;
    try testing.expectEqualStrings("uuid self generate", cmd0.get("command").?.string);
    try testing.expectEqualStrings("uuid", cmd0.get("namespace").?.string);
    try testing.expectEqualStrings("self", cmd0.get("resource").?.string);
    try testing.expectEqualStrings("generate", cmd0.get("action").?.string);
    try testing.expectEqualStrings("Generate a UUID", cmd0.get("description").?.string);
    try testing.expectEqualStrings("process", cmd0.get("adapter").?.string);

    const cmd1 = cmds.items[1].object;
    try testing.expectEqualStrings("http check health", cmd1.get("command").?.string);
    try testing.expectEqualStrings("http", cmd1.get("namespace").?.string);
}

test "handleCommands with empty lock produces empty commands array" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var lock = try th.buildLock(gpa, &.{});
    defer lock.deinit();

    var flags = std.StringHashMap([]const u8).init(gpa);
    defer flags.deinit();

    var cap = th.OutputCapture{ .alloc = gpa };
    cap.install();
    defer cap.release();

    try handleCommands(gpa, &lock, .json, flags);

    const parsed = try th.parseJson(gpa, cap.stdout());
    defer parsed.deinit();

    const root = parsed.value.object;
    try testing.expectEqual(@as(i64, 0), root.get("total").?.integer);
    try testing.expectEqual(@as(i64, 0), root.get("returned").?.integer);
    try testing.expectEqual(@as(usize, 0), root.get("commands").?.array.items.len);
}

test "handleCommands --query filters by substring" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var lock = try buildTwoCmdLock(gpa);
    defer lock.deinit();

    var flags = std.StringHashMap([]const u8).init(gpa);
    defer flags.deinit();
    try flags.put("query", "health");

    var cap = th.OutputCapture{ .alloc = gpa };
    cap.install();
    defer cap.release();

    try handleCommands(gpa, &lock, .json, flags);

    const parsed = try th.parseJson(gpa, cap.stdout());
    defer parsed.deinit();

    const root = parsed.value.object;
    try testing.expectEqual(@as(i64, 1), root.get("total").?.integer);
    const cmds = root.get("commands").?.array;
    try testing.expectEqual(@as(usize, 1), cmds.items.len);
    try testing.expectEqualStrings("http", cmds.items[0].object.get("namespace").?.string);
}

test "handleCommands --limit caps returned count" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var lock = try buildTwoCmdLock(gpa);
    defer lock.deinit();

    var flags = std.StringHashMap([]const u8).init(gpa);
    defer flags.deinit();
    try flags.put("limit", "1");

    var cap = th.OutputCapture{ .alloc = gpa };
    cap.install();
    defer cap.release();

    try handleCommands(gpa, &lock, .json, flags);

    const parsed = try th.parseJson(gpa, cap.stdout());
    defer parsed.deinit();

    const root = parsed.value.object;
    try testing.expectEqual(@as(i64, 2), root.get("total").?.integer);
    try testing.expectEqual(@as(i64, 1), root.get("returned").?.integer);
    try testing.expectEqual(@as(usize, 1), root.get("commands").?.array.items.len);
}

test "handleCommands human mode writes non-JSON summary" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var lock = try buildTwoCmdLock(gpa);
    defer lock.deinit();

    var flags = std.StringHashMap([]const u8).init(gpa);
    defer flags.deinit();

    var cap = th.OutputCapture{ .alloc = gpa };
    cap.install();
    defer cap.release();

    try handleCommands(gpa, &lock, .human, flags);

    // Human output is not JSON; just verify it contains the command tokens.
    try testing.expect(std.mem.indexOf(u8, cap.stdout(), "uuid self generate") != null);
    try testing.expect(std.mem.indexOf(u8, cap.stdout(), "Returned:") != null);
}

test "handleInspect JSON output structure" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var lock = try buildTwoCmdLock(gpa);
    defer lock.deinit();

    var cap = th.OutputCapture{ .alloc = gpa };
    cap.install();
    defer cap.release();

    handleInspect(gpa, &lock, .json, "uuid", "self", "generate");

    const parsed = try th.parseJson(gpa, cap.stdout());
    defer parsed.deinit();

    const root = parsed.value.object;
    try testing.expectEqualStrings("1.0", root.get("version").?.string);
    try testing.expectEqualStrings("uuid.self.generate", root.get("command").?.string);
    try testing.expectEqualStrings("Generate a UUID", root.get("description").?.string);
    try testing.expectEqualStrings("process", root.get("adapter").?.string);
    try testing.expect(root.get("adapterConfig").? == .null);
    try testing.expectEqual(@as(usize, 0), root.get("args").?.array.items.len);
}

test "handleInspect human mode writes header and description" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var lock = try buildTwoCmdLock(gpa);
    defer lock.deinit();

    var cap = th.OutputCapture{ .alloc = gpa };
    cap.install();
    defer cap.release();

    handleInspect(gpa, &lock, .human, "uuid", "self", "generate");

    try testing.expect(std.mem.indexOf(u8, cap.stdout(), "uuid.self.generate") != null);
    try testing.expect(std.mem.indexOf(u8, cap.stdout(), "Generate a UUID") != null);
    try testing.expect(std.mem.indexOf(u8, cap.stdout(), "Adapter:") != null);
}

test "handleCommands filtering by namespace works via config.allCommands" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var lock = try buildTwoCmdLock(gpa);
    defer lock.deinit();

    const all_cmds = try config.allCommands(&lock, testing.allocator);
    defer testing.allocator.free(all_cmds);
    try testing.expectEqual(@as(usize, 2), all_cmds.len);

    const found = config.findCommand(&lock, "uuid", "self", "generate");
    try testing.expect(found != null);
    try testing.expectEqualStrings("uuid", found.?.namespace);

    const not_found = config.findCommand(&lock, "uuid", "self", "health");
    try testing.expect(not_found == null);
}
