// args.zig — Argument parsing for sc-zig.
const std = @import("std");
const output = @import("output.zig");

pub const RESERVED_FLAGS = [_][]const u8{ "json", "human", "compact", "schema", "help", "help-json", "no-color", "format" };
pub const BOOL_FLAGS = [_][]const u8{ "json", "human", "compact", "replace", "check", "force", "installed" };

/// Parsed command-line state.
pub const Args = struct {
    positional: [][]const u8,
    flags: std.StringHashMap([]const u8),
    mode: output.Mode,
    raw_args: [][]const u8,
    allocator: std.mem.Allocator,

    pub fn deinit(self: *Args) void {
        self.allocator.free(self.positional);
        self.allocator.free(self.raw_args);
        var self_flags = self.flags;
        self_flags.deinit();
    }
};

pub fn isBoolFlag(name: []const u8, custom_bool_flags: ?std.StringHashMap(void)) bool {
    if (custom_bool_flags) |cbf| {
        if (cbf.contains(name)) return true;
    }
    for (BOOL_FLAGS) |f| {
        if (std.mem.eql(u8, name, f)) return true;
    }
    return false;
}

pub fn parseArgs(gpa: std.mem.Allocator, args_iter: []const []const u8, custom_bool_flags: ?std.StringHashMap(void)) !Args {
    var positional: std.ArrayList([]const u8) = .empty;
    var flags = std.StringHashMap([]const u8).init(gpa);
    var raw_args: std.ArrayList([]const u8) = .empty;
    var mode = output.Mode.json;
    var has_human = false;
    var end_of_options = false;

    var i: usize = 0;
    while (i < args_iter.len) : (i += 1) {
        const arg = args_iter[i];
        try raw_args.append(gpa, arg);

        if (std.mem.startsWith(u8, arg, "--") and !end_of_options) {
            const kv = arg[2..];
            if (kv.len == 0) { end_of_options = true; continue; }
            if (std.mem.indexOf(u8, kv, "=")) |eq| {
                const k = kv[0..eq];
                const v = kv[eq + 1 ..];
                try flags.put(k, v);
                if (std.mem.eql(u8, k, "human")) has_human = true;
            } else if (!isBoolFlag(kv, custom_bool_flags) and i + 1 < args_iter.len and !std.mem.startsWith(u8, args_iter[i + 1], "--")) {
                i += 1;
                const v = args_iter[i];
                try raw_args.append(gpa, v);
                try flags.put(kv, v);
                if (std.mem.eql(u8, kv, "human")) has_human = true;
            } else {
                try flags.put(kv, "true");
                if (std.mem.eql(u8, kv, "human")) has_human = true;
            }
        } else {
            try positional.append(gpa, arg);
        }
    }

    if (has_human) { mode = .human; } else { mode = .json; }

    return Args{
        .positional = try positional.toOwnedSlice(gpa),
        .flags = flags,
        .mode = mode,
        .raw_args = try raw_args.toOwnedSlice(gpa),
        .allocator = gpa,
    };
}

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
