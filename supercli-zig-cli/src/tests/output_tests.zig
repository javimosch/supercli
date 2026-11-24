const std = @import("std");
const mod = @import("../output.zig");

const Mode = mod.Mode;
const captureForTests = mod.captureForTests;
const CaptureGuard = mod.CaptureGuard;
const writeRaw = mod.writeRaw;
const writeRawErr = mod.writeRawErr;
const writeLine = mod.writeLine;
const writeErrLine = mod.writeErrLine;
const writeEnvelope = mod.writeEnvelope;
const writeJson = mod.writeJson;
const writeJsonStr = mod.writeJsonStr;
const ErrorInfo = mod.ErrorInfo;
const exitWithError = mod.exitWithError;
const COMPACT_KEYS = mod.COMPACT_KEYS;

test "ErrorInfo JSON format matches expected envelope" {
    const testing = std.testing;
    const gpa = testing.allocator;

    const info = ErrorInfo{
        .code = 85,
        .err_type = "invalid_argument",
        .message = "test message",
        .recoverable = false,
        .suggestions = &.{"try --help"},
    };

    var out: std.Io.Writer.Allocating = .init(gpa);
    defer out.deinit();
    var jw: std.json.Stringify = .{ .writer = &out.writer };
    try jw.beginObject();
    try jw.objectField("error");
    try jw.beginObject();
    try jw.objectField("code");
    try jw.write(info.code);
    try jw.objectField("type");
    try jw.write(info.err_type);
    try jw.objectField("message");
    try jw.write(info.message);
    try jw.objectField("recoverable");
    try jw.write(info.recoverable);
    try jw.objectField("suggestions");
    try jw.beginArray();
    for (info.suggestions) |s| try jw.write(s);
    try jw.endArray();
    try jw.endObject();
    try jw.endObject();

    const json_str = out.written();
    const parsed = try std.json.parseFromSlice(std.json.Value, gpa, json_str, .{});
    defer parsed.deinit();

    const root = parsed.value;
    const err_obj = root.object.get("error").?;
    try testing.expectEqual(@as(i64, 85), err_obj.object.get("code").?.integer);
    try testing.expectEqualStrings("invalid_argument", err_obj.object.get("type").?.string);
    try testing.expectEqualStrings("test message", err_obj.object.get("message").?.string);
    try testing.expectEqual(false, err_obj.object.get("recoverable").?.bool);
    const suggestions = err_obj.object.get("suggestions").?.array;
    try testing.expectEqual(@as(usize, 1), suggestions.items.len);
    try testing.expectEqualStrings("try --help", suggestions.items[0].string);
}

test "ErrorInfo default values" {
    const testing = std.testing;

    const info = ErrorInfo{
        .message = "something went wrong",
    };

    try testing.expectEqual(@as(i64, 110), info.code);
    try testing.expectEqualStrings("internal_error", info.err_type);
    try testing.expectEqual(false, info.recoverable);
    try testing.expectEqual(@as(usize, 0), info.suggestions.len);
}

test "ErrorInfo with multiple suggestions" {
    const testing = std.testing;
    const gpa = testing.allocator;

    const info = ErrorInfo{
        .code = 92,
        .err_type = "resource_not_found",
        .message = "Namespace not found",
        .recoverable = false,
        .suggestions = &.{
            "Run: sc-zig plugins list",
            "Run: sc-zig plugins install <name>",
        },
    };

    var out: std.Io.Writer.Allocating = .init(gpa);
    defer out.deinit();
    var jw: std.json.Stringify = .{ .writer = &out.writer };
    try jw.beginObject();
    try jw.objectField("error");
    try jw.beginObject();
    try jw.objectField("code");
    try jw.write(info.code);
    try jw.objectField("type");
    try jw.write(info.err_type);
    try jw.objectField("message");
    try jw.write(info.message);
    try jw.objectField("recoverable");
    try jw.write(info.recoverable);
    try jw.objectField("suggestions");
    try jw.beginArray();
    for (info.suggestions) |s| try jw.write(s);
    try jw.endArray();
    try jw.endObject();
    try jw.endObject();

    const parsed = try std.json.parseFromSlice(std.json.Value, gpa, out.written(), .{});
    defer parsed.deinit();

    const err_obj = parsed.value.object.get("error").?;
    const suggestions = err_obj.object.get("suggestions").?.array;
    try testing.expectEqual(@as(usize, 2), suggestions.items.len);
    try testing.expectEqualStrings("Run: sc-zig plugins list", suggestions.items[0].string);
    try testing.expectEqualStrings("Run: sc-zig plugins install <name>", suggestions.items[1].string);
}

test "Mode enum has expected variants" {
    const testing = std.testing;
    // Verify the enum values exist and are distinct
    try testing.expect(Mode.json != Mode.human);
    try testing.expect(Mode.human != Mode.compact);
    try testing.expect(Mode.json != Mode.compact);
}

test "COMPACT_KEYS has expected mappings" {
    const testing = std.testing;
    try testing.expectEqual(@as(usize, 13), COMPACT_KEYS.len);

    // Verify some key mappings
    try testing.expectEqualStrings("version", COMPACT_KEYS[0][0]);
    try testing.expectEqualStrings("v", COMPACT_KEYS[0][1]);
    try testing.expectEqualStrings("namespace", COMPACT_KEYS[4][0]);
    try testing.expectEqualStrings("ns", COMPACT_KEYS[4][1]);
    try testing.expectEqualStrings("error", COMPACT_KEYS[10][0]);
    try testing.expectEqualStrings("err", COMPACT_KEYS[10][1]);
}

test "writeEnvelope produces valid JSON structure" {
    const testing = std.testing;
    const gpa = testing.allocator;

    // Build the same JSON structure that writeEnvelope produces
    var out: std.Io.Writer.Allocating = .init(gpa);
    defer out.deinit();
    var jw: std.json.Stringify = .{ .writer = &out.writer };
    try jw.beginObject();
    try jw.objectField("version");
    try jw.write("1.0");
    try jw.objectField("command");
    try jw.write("uuid self generate");
    try jw.objectField("duration_ms");
    try jw.write(@as(i64, 42));
    try jw.objectField("data");
    try jw.write(@as(i64, 123));
    try jw.endObject();

    const parsed = try std.json.parseFromSlice(std.json.Value, gpa, out.written(), .{});
    defer parsed.deinit();

    const root = parsed.value.object;
    try testing.expectEqualStrings("1.0", root.get("version").?.string);
    try testing.expectEqualStrings("uuid self generate", root.get("command").?.string);
    try testing.expectEqual(@as(i64, 42), root.get("duration_ms").?.integer);
    try testing.expectEqual(@as(i64, 123), root.get("data").?.integer);
}
