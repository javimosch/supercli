const std = @import("std");
const mod = @import("../args.zig");
const output = @import("../output.zig");

const RESERVED_FLAGS = mod.RESERVED_FLAGS;
const BOOL_FLAGS = mod.BOOL_FLAGS;
const Args = mod.Args;
const isBoolFlag = mod.isBoolFlag;
const parseArgs = mod.parseArgs;

test "parseArgs basic and custom boolean flag re-parsing" {
    const testing = std.testing;
    const gpa = testing.allocator;

    {
        const argv = &[_][]const u8{ "namespace", "--flag1=value1", "--flag2=" };
        var parsed = try parseArgs(gpa, argv, null);
        defer parsed.deinit();
        try testing.expectEqual(@as(usize, 1), parsed.positional.len);
        try testing.expectEqualStrings("namespace", parsed.positional[0]);
        try testing.expectEqualStrings("value1", parsed.flags.get("flag1").?);
        try testing.expectEqualStrings("", parsed.flags.get("flag2").?);
    }

    {
        const argv = &[_][]const u8{ "ns", "res", "act", "--custom-bool", "positional_arg" };
        var parsed1 = try parseArgs(gpa, argv, null);
        defer parsed1.deinit();
        try testing.expectEqual(@as(usize, 3), parsed1.positional.len);
        try testing.expectEqualStrings("positional_arg", parsed1.flags.get("custom-bool").?);

        var custom_bool_flags = std.StringHashMap(void).init(gpa);
        defer custom_bool_flags.deinit();
        try custom_bool_flags.put("custom-bool", {});

        var parsed2 = try parseArgs(gpa, argv, custom_bool_flags);
        defer parsed2.deinit();
        try testing.expectEqual(@as(usize, 4), parsed2.positional.len);
        try testing.expectEqualStrings("true", parsed2.flags.get("custom-bool").?);
    }

    {
        const argv = &[_][]const u8{ "ns", "res", "act", "--", "--foo", "bar", "--json" };
        var parsed = try parseArgs(gpa, argv, null);
        defer parsed.deinit();
        try testing.expectEqual(@as(usize, 6), parsed.positional.len);
        try testing.expectEqual(@as(?[]const u8, null), parsed.flags.get("foo"));
        try testing.expectEqual(@as(?[]const u8, null), parsed.flags.get("json"));
    }

    {
        const argv = &[_][]const u8{ "commands", "--limit", "10" };
        var parsed = try parseArgs(gpa, argv, null);
        defer parsed.deinit();
        try testing.expectEqualStrings("10", parsed.flags.get("limit").?);
        try testing.expectEqual(@as(usize, 1), parsed.positional.len);
    }

    {
        const argv = &[_][]const u8{ "commands", "--limit" };
        var parsed = try parseArgs(gpa, argv, null);
        defer parsed.deinit();
        try testing.expectEqualStrings("true", parsed.flags.get("limit").?);
        try testing.expectEqual(@as(usize, 1), parsed.positional.len);
    }
}

test "isBoolFlag recognizes standard boolean flags" {
    const testing = std.testing;

    try testing.expect(isBoolFlag("json", null));
    try testing.expect(isBoolFlag("human", null));
    try testing.expect(isBoolFlag("compact", null));
    try testing.expect(isBoolFlag("replace", null));
    try testing.expect(isBoolFlag("check", null));
    try testing.expect(isBoolFlag("force", null));
    try testing.expect(isBoolFlag("installed", null));
}

test "isBoolFlag returns false for non-boolean flags" {
    const testing = std.testing;

    try testing.expect(!isBoolFlag("limit", null));
    try testing.expect(!isBoolFlag("query", null));
    try testing.expect(!isBoolFlag("name", null));
    try testing.expect(!isBoolFlag("namespace", null));
    try testing.expect(!isBoolFlag("unknown-flag", null));
}

test "isBoolFlag recognizes custom boolean flags" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var custom_bool_flags = std.StringHashMap(void).init(gpa);
    defer custom_bool_flags.deinit();
    try custom_bool_flags.put("my-custom-bool", {});
    try custom_bool_flags.put("verbose", {});

    try testing.expect(isBoolFlag("my-custom-bool", custom_bool_flags));
    try testing.expect(isBoolFlag("verbose", custom_bool_flags));
    // Standard flags should still work with custom flags
    try testing.expect(isBoolFlag("json", custom_bool_flags));
    // Non-bool flags should still return false
    try testing.expect(!isBoolFlag("limit", custom_bool_flags));
}

test "parseArgs --human flag sets mode to human" {
    const testing = std.testing;
    const gpa = testing.allocator;

    const argv = &[_][]const u8{ "commands", "--human" };
    var parsed = try parseArgs(gpa, argv, null);
    defer parsed.deinit();
    try testing.expectEqual(output.Mode.human, parsed.mode);
    try testing.expectEqualStrings("true", parsed.flags.get("human").?);
}

test "parseArgs without --human defaults to json mode" {
    const testing = std.testing;
    const gpa = testing.allocator;

    const argv = &[_][]const u8{ "commands", "--limit", "10" };
    var parsed = try parseArgs(gpa, argv, null);
    defer parsed.deinit();
    try testing.expectEqual(output.Mode.json, parsed.mode);
}

test "parseArgs --json flag does not set human mode" {
    const testing = std.testing;
    const gpa = testing.allocator;

    const argv = &[_][]const u8{ "commands", "--json" };
    var parsed = try parseArgs(gpa, argv, null);
    defer parsed.deinit();
    try testing.expectEqual(output.Mode.json, parsed.mode);
    try testing.expectEqualStrings("true", parsed.flags.get("json").?);
}

test "parseArgs -- separator treats rest as positional" {
    const testing = std.testing;
    const gpa = testing.allocator;

    const argv = &[_][]const u8{ "ns", "--", "--flag", "value", "--json" };
    var parsed = try parseArgs(gpa, argv, null);
    defer parsed.deinit();
    try testing.expectEqual(@as(usize, 4), parsed.positional.len);
    try testing.expectEqualStrings("ns", parsed.positional[0]);
    try testing.expectEqualStrings("--flag", parsed.positional[1]);
    try testing.expectEqualStrings("value", parsed.positional[2]);
    try testing.expectEqualStrings("--json", parsed.positional[3]);
    // No flags should be set
    try testing.expectEqual(@as(?[]const u8, null), parsed.flags.get("flag"));
    try testing.expectEqual(@as(?[]const u8, null), parsed.flags.get("json"));
}

test "parseArgs empty input returns empty results" {
    const testing = std.testing;
    const gpa = testing.allocator;

    const argv = &[_][]const u8{};
    var parsed = try parseArgs(gpa, argv, null);
    defer parsed.deinit();
    try testing.expectEqual(@as(usize, 0), parsed.positional.len);
    try testing.expectEqual(output.Mode.json, parsed.mode);
}

test "parseArgs raw_args captures all arguments" {
    const testing = std.testing;
    const gpa = testing.allocator;

    const argv = &[_][]const u8{ "ns", "res", "act", "--flag", "value" };
    var parsed = try parseArgs(gpa, argv, null);
    defer parsed.deinit();
    // raw_args should contain all args including the flag value
    try testing.expectEqual(@as(usize, 5), parsed.raw_args.len);
    try testing.expectEqualStrings("ns", parsed.raw_args[0]);
    try testing.expectEqualStrings("res", parsed.raw_args[1]);
    try testing.expectEqualStrings("act", parsed.raw_args[2]);
    try testing.expectEqualStrings("--flag", parsed.raw_args[3]);
    try testing.expectEqualStrings("value", parsed.raw_args[4]);
}

test "RESERVED_FLAGS contains expected flags" {
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

test "BOOL_FLAGS contains expected flags" {
    const testing = std.testing;
    try testing.expectEqual(@as(usize, 7), BOOL_FLAGS.len);
    try testing.expectEqualStrings("json", BOOL_FLAGS[0]);
    try testing.expectEqualStrings("human", BOOL_FLAGS[1]);
    try testing.expectEqualStrings("compact", BOOL_FLAGS[2]);
    try testing.expectEqualStrings("replace", BOOL_FLAGS[3]);
    try testing.expectEqualStrings("check", BOOL_FLAGS[4]);
    try testing.expectEqualStrings("force", BOOL_FLAGS[5]);
    try testing.expectEqualStrings("installed", BOOL_FLAGS[6]);
}
