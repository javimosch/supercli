// output.zig — JSON/human output helpers matching the Node.js sc envelope format
const std = @import("std");
const linux = std.os.linux;

pub const Mode = enum { json, human, compact };

pub fn writeRaw(s: []const u8) void {
    _ = linux.write(1, s.ptr, s.len);
}

pub fn writeRawErr(s: []const u8) void {
    _ = linux.write(2, s.ptr, s.len);
}

pub fn writeLine(s: []const u8) void {
    writeRaw(s);
    writeRaw("\n");
}

pub fn writeErrLine(s: []const u8) void {
    writeRawErr(s);
    writeRawErr("\n");
}

// Write a JSON value envelope: {version:"1.0", command, duration_ms, data}
pub fn writeEnvelope(
    gpa: std.mem.Allocator,
    command: []const u8,
    duration_ms: i64,
    data: std.json.Value,
) void {
    var out: std.Io.Writer.Allocating = .init(gpa);
    defer out.deinit();
    var jw: std.json.Stringify = .{ .writer = &out.writer };
    jw.beginObject() catch return;
    jw.objectField("version") catch return;
    jw.write("1.0") catch return;
    jw.objectField("command") catch return;
    jw.write(command) catch return;
    jw.objectField("duration_ms") catch return;
    jw.write(duration_ms) catch return;
    jw.objectField("data") catch return;
    jw.write(data) catch return;
    jw.endObject() catch return;
    writeRaw(out.written());
    writeRaw("\n");
}

// Write a raw data JSON value (no envelope wrapping)
pub fn writeJson(gpa: std.mem.Allocator, data: std.json.Value) void {
    var out: std.Io.Writer.Allocating = .init(gpa);
    defer out.deinit();
    var jw: std.json.Stringify = .{ .writer = &out.writer };
    jw.write(data) catch return;
    writeRaw(out.written());
    writeRaw("\n");
}

// Write a string as JSON value
pub fn writeJsonStr(gpa: std.mem.Allocator, s: []const u8) void {
    var out: std.Io.Writer.Allocating = .init(gpa);
    defer out.deinit();
    var jw: std.json.Stringify = .{ .writer = &out.writer };
    jw.write(s) catch return;
    writeRaw(out.written());
    writeRaw("\n");
}

pub const ErrorInfo = struct {
    code: i64 = 110,
    err_type: []const u8 = "internal_error",
    message: []const u8,
    recoverable: bool = false,
    suggestions: []const []const u8 = &.{},
};

// Write error envelope to stderr + exit
pub fn exitWithError(gpa: std.mem.Allocator, mode: Mode, info: ErrorInfo) noreturn {
    if (mode == .human) {
        writeRawErr(info.err_type);
        writeRawErr(": ");
        writeRawErr(info.message);
        writeRawErr("\n");
        for (info.suggestions) |s| {
            writeRawErr("  -> ");
            writeRawErr(s);
            writeRawErr("\n");
        }
    } else {
        var out: std.Io.Writer.Allocating = .init(gpa);
        defer out.deinit();
        var jw: std.json.Stringify = .{ .writer = &out.writer };
        jw.beginObject() catch {};
        jw.objectField("error") catch {};
        jw.beginObject() catch {};
        jw.objectField("code") catch {};
        jw.write(info.code) catch {};
        jw.objectField("type") catch {};
        jw.write(info.err_type) catch {};
        jw.objectField("message") catch {};
        jw.write(info.message) catch {};
        jw.objectField("recoverable") catch {};
        jw.write(info.recoverable) catch {};
        jw.objectField("suggestions") catch {};
        jw.beginArray() catch {};
        for (info.suggestions) |s| jw.write(s) catch {};
        jw.endArray() catch {};
        jw.endObject() catch {};
        jw.endObject() catch {};
        writeRawErr(out.written());
        writeRawErr("\n");
    }
    std.process.exit(@intCast(@max(0, @min(info.code, 255))));
}

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

// Compact key map — match Node.js compactKeys()
pub const COMPACT_KEYS = [_][2][]const u8{
    .{ "version", "v" },
    .{ "command", "c" },
    .{ "duration_ms", "ms" },
    .{ "data", "d" },
    .{ "namespace", "ns" },
    .{ "resource", "r" },
    .{ "action", "a" },
    .{ "description", "desc" },
    .{ "adapter", "ad" },
    .{ "commands", "cmds" },
    .{ "error", "err" },
    .{ "message", "msg" },
    .{ "suggestions", "sug" },
};
