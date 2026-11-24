const std = @import("std");
const executor = @import("../executor.zig");

const ExecResult = executor.ExecResult;
const ExecOptions = executor.ExecOptions;
const ArgDef = executor.ArgDef;
const AdapterConfig = executor.AdapterConfig;
const parseArgDefs = executor.parseArgDefs;
const parseAdapterConfig = executor.parseAdapterConfig;
const buildFlagArgs = executor.buildFlagArgs;
const validateNonTtySafety = executor.validateNonTtySafety;

test "validateNonTtySafety basic tests" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var threaded = std.Io.Threaded.init(gpa, .{});
    defer threaded.deinit();
    const io = threaded.io();

    const acfg1 = AdapterConfig{
        .requires_interactive = true,
    };
    const argv1 = &[_][]const u8{"hello"};
    
    const is_tty = std.Io.File.stdout().isTty(io) catch false;
    if (!is_tty) {
        try testing.expectError(error.SafetyViolation, validateNonTtySafety(io, gpa, acfg1.requires_interactive, acfg1.interactive_flags, argv1));
    } else {
        try validateNonTtySafety(io, gpa, acfg1.requires_interactive, acfg1.interactive_flags, argv1);
    }

    const acfg2 = AdapterConfig{
        .requires_interactive = false,
        .interactive_flags = @constCast(&[_][]const u8{ "--interactive", "-i" }),
    };

    if (!is_tty) {
        const argv_unsafe1 = &[_][]const u8{ "--interactive" };
        try testing.expectError(error.SafetyViolation, validateNonTtySafety(io, gpa, acfg2.requires_interactive, acfg2.interactive_flags, argv_unsafe1));

        const argv_unsafe2 = &[_][]const u8{ "-i" };
        try testing.expectError(error.SafetyViolation, validateNonTtySafety(io, gpa, acfg2.requires_interactive, acfg2.interactive_flags, argv_unsafe2));

        const argv_unsafe3 = &[_][]const u8{ "--interactive=true" };
        try testing.expectError(error.SafetyViolation, validateNonTtySafety(io, gpa, acfg2.requires_interactive, acfg2.interactive_flags, argv_unsafe3));

        const argv_safe = &[_][]const u8{ "--some-other-flag" };
        try validateNonTtySafety(io, gpa, acfg2.requires_interactive, acfg2.interactive_flags, argv_safe);
    }
}

test "parseArgDefs extracts arg definitions from JSON" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var arena = std.heap.ArenaAllocator.init(gpa);
    defer arena.deinit();
    const arena_alloc = arena.allocator();

    const json_str =
        \\[{"name":"query","positional":true,"required":true,"type":"string"},{"name":"verbose","type":"boolean"},{"name":"limit","type":"string","required":false}]
    ;
    const parsed = try std.json.parseFromSliceLeaky(std.json.Value, arena_alloc, json_str, .{});

    const arg_defs = try parseArgDefs(arena_alloc, parsed);
    try testing.expectEqual(@as(usize, 3), arg_defs.len);
    try testing.expectEqualStrings("query", arg_defs[0].name);
    try testing.expect(arg_defs[0].positional);
    try testing.expect(arg_defs[0].required);
    try testing.expect(!arg_defs[0].is_bool);

    try testing.expectEqualStrings("verbose", arg_defs[1].name);
    try testing.expect(!arg_defs[1].positional);
    try testing.expect(!arg_defs[1].required);
    try testing.expect(arg_defs[1].is_bool);

    try testing.expectEqualStrings("limit", arg_defs[2].name);
    try testing.expect(!arg_defs[2].is_bool);
}

test "parseArgDefs returns empty for null input" {
    const testing = std.testing;
    const gpa = testing.allocator;

    const arg_defs = try parseArgDefs(gpa, null);
    defer gpa.free(arg_defs);
    try testing.expectEqual(@as(usize, 0), arg_defs.len);
}

test "parseArgDefs returns empty for non-array input" {
    const testing = std.testing;
    const gpa = testing.allocator;

    const arg_defs = try parseArgDefs(gpa, std.json.Value{ .string = "not an array" });
    defer gpa.free(arg_defs);
    try testing.expectEqual(@as(usize, 0), arg_defs.len);
}

test "parseArgDefs skips items without name field" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var arena = std.heap.ArenaAllocator.init(gpa);
    defer arena.deinit();
    const arena_alloc = arena.allocator();

    const json_str =
        \\[{"name":"valid"},{"positional":true},{"name":"also-valid","type":"boolean"}]
    ;
    const parsed = try std.json.parseFromSliceLeaky(std.json.Value, arena_alloc, json_str, .{});

    const arg_defs = try parseArgDefs(arena_alloc, parsed);

    try testing.expectEqual(@as(usize, 2), arg_defs.len);
    try testing.expectEqualStrings("valid", arg_defs[0].name);
    try testing.expectEqualStrings("also-valid", arg_defs[1].name);
    try testing.expect(arg_defs[1].is_bool);
}

test "parseAdapterConfig extracts command and baseArgs" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var arena = std.heap.ArenaAllocator.init(gpa);
    defer arena.deinit();
    const arena_alloc = arena.allocator();

    const json_str =
        \\{"command":"uuidgen","baseArgs":["--version","4"],"passthrough":false,"parseJson":true,"timeout_ms":5000}
    ;
    const parsed = try std.json.parseFromSliceLeaky(std.json.Value, arena_alloc, json_str, .{});

    const acfg = try parseAdapterConfig(arena_alloc, parsed);

    try testing.expectEqualStrings("uuidgen", acfg.command);
    try testing.expectEqual(@as(usize, 2), acfg.base_args.len);
    try testing.expectEqualStrings("--version", acfg.base_args[0]);
    try testing.expectEqualStrings("4", acfg.base_args[1]);
    try testing.expect(!acfg.passthrough);
    try testing.expect(acfg.parse_json);
    try testing.expectEqual(@as(u64, 5000), acfg.timeout_ms);
}

test "parseAdapterConfig returns defaults for null input" {
    const testing = std.testing;
    const gpa = testing.allocator;

    const acfg = try parseAdapterConfig(gpa, null);
    try testing.expectEqualStrings("", acfg.command);
    try testing.expect(!acfg.passthrough);
    try testing.expect(acfg.parse_json);
    try testing.expectEqual(@as(u64, 15000), acfg.timeout_ms);
}

test "parseAdapterConfig handles passthrough and interactive flags" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var arena = std.heap.ArenaAllocator.init(gpa);
    defer arena.deinit();
    const arena_alloc = arena.allocator();

    const json_str =
        \\{"command":"vim","passthrough":true,"requiresInteractive":true,"interactiveFlags":["--interactive","-i"]}
    ;
    const parsed = try std.json.parseFromSliceLeaky(std.json.Value, arena_alloc, json_str, .{});

    const acfg = try parseAdapterConfig(arena_alloc, parsed);

    try testing.expectEqualStrings("vim", acfg.command);
    try testing.expect(acfg.passthrough);
    try testing.expect(acfg.requires_interactive);
    try testing.expectEqual(@as(usize, 2), acfg.interactive_flags.len);
    try testing.expectEqualStrings("--interactive", acfg.interactive_flags[0]);
    try testing.expectEqualStrings("-i", acfg.interactive_flags[1]);
}

test "parseAdapterConfig ignores invoke_cwd and plugin_dir for cwd" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var arena = std.heap.ArenaAllocator.init(gpa);
    defer arena.deinit();
    const arena_alloc = arena.allocator();

    const json_str =
        \\{"command":"tool","cwd":"invoke_cwd"}
    ;
    const parsed = try std.json.parseFromSliceLeaky(std.json.Value, arena_alloc, json_str, .{});

    const acfg = try parseAdapterConfig(arena_alloc, parsed);
    try testing.expect(acfg.cwd == null);
}

test "parseAdapterConfig sets cwd for explicit path" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var arena = std.heap.ArenaAllocator.init(gpa);
    defer arena.deinit();
    const arena_alloc = arena.allocator();

    const json_str =
        \\{"command":"tool","cwd":"/custom/path"}
    ;
    const parsed = try std.json.parseFromSliceLeaky(std.json.Value, arena_alloc, json_str, .{});

    const acfg = try parseAdapterConfig(arena_alloc, parsed);
    try testing.expect(acfg.cwd != null);
    try testing.expectEqualStrings("/custom/path", acfg.cwd.?);
}

test "buildFlagArgs builds positional and named args correctly" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var arena = std.heap.ArenaAllocator.init(gpa);
    defer arena.deinit();
    const arena_alloc = arena.allocator();

    var flags = std.StringHashMap([]const u8).init(arena_alloc);
    defer flags.deinit();
    try flags.put("query", "test-value");
    try flags.put("verbose", "true");
    try flags.put("limit", "10");
    try flags.put("json", "true"); // should be skipped

    var arg_defs = [_]ArgDef{
        .{ .name = "query", .positional = true, .required = true },
        .{ .name = "verbose", .is_bool = true },
    };

    var skip_keys = [_][]const u8{ "json", "human", "limit" };

    const result = try buildFlagArgs(arena_alloc, flags, &skip_keys, &arg_defs);

    // Positional "query" should come first, then "verbose" flag
    // "limit" and "json" are in skip_keys so they should be skipped
    try testing.expectEqual(@as(usize, 2), result.len);
    try testing.expectEqualStrings("test-value", result[0]); // positional
    try testing.expectEqualStrings("--verbose", result[1]); // bool flag
}

test "buildFlagArgs handles empty flags" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var arena = std.heap.ArenaAllocator.init(gpa);
    defer arena.deinit();
    const arena_alloc = arena.allocator();

    var flags = std.StringHashMap([]const u8).init(arena_alloc);
    defer flags.deinit();

    var skip_keys = [_][]const u8{};
    const result = try buildFlagArgs(arena_alloc, flags, &skip_keys, &.{});

    try testing.expectEqual(@as(usize, 0), result.len);
}

test "buildFlagArgs skips false-valued flags" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var arena = std.heap.ArenaAllocator.init(gpa);
    defer arena.deinit();
    const arena_alloc = arena.allocator();

    var flags = std.StringHashMap([]const u8).init(arena_alloc);
    defer flags.deinit();
    try flags.put("verbose", "false");
    try flags.put("active", "true");

    var skip_keys = [_][]const u8{};
    const result = try buildFlagArgs(arena_alloc, flags, &skip_keys, &.{});

    // "false" flags should be skipped, "true" flags become --flag
    try testing.expectEqual(@as(usize, 1), result.len);
    try testing.expectEqualStrings("--active", result[0]);
}

test "buildFlagArgs skips empty-valued flags" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var arena = std.heap.ArenaAllocator.init(gpa);
    defer arena.deinit();
    const arena_alloc = arena.allocator();

    var flags = std.StringHashMap([]const u8).init(arena_alloc);
    defer flags.deinit();
    try flags.put("empty", "");
    try flags.put("name", "value");

    var skip_keys = [_][]const u8{};
    const result = try buildFlagArgs(arena_alloc, flags, &skip_keys, &.{});

    try testing.expectEqual(@as(usize, 2), result.len);
    try testing.expectEqualStrings("--name", result[0]);
    try testing.expectEqualStrings("value", result[1]);
}

test "ExecResult variants are distinct" {
    const testing = std.testing;

    const r1 = ExecResult{ .passthrough = {} };
    try testing.expect(r1 == .passthrough);

    const r2 = ExecResult{ .raw = "hello" };
    try testing.expect(r2 == .raw);
    try testing.expectEqualStrings("hello", r2.raw);

    const r3 = ExecResult{ .err = .{ .message = "failed", .exit_code = 1 } };
    try testing.expect(r3 == .err);
    try testing.expectEqualStrings("failed", r3.err.message);
    try testing.expectEqual(@as(u8, 1), r3.err.exit_code);
}

test "ExecOptions has expected defaults" {
    const testing = std.testing;

    const opts = ExecOptions{};
    try testing.expect(!opts.passthrough);
    try testing.expect(opts.parse_json);
    try testing.expectEqual(@as(u64, 15000), opts.timeout_ms);
    try testing.expect(opts.cwd == null);
    try testing.expect(!opts.requires_interactive);
    try testing.expectEqual(@as(usize, 0), opts.base_args.len);
    try testing.expectEqual(@as(usize, 0), opts.extra_args.len);
}

test "AdapterConfig has expected defaults" {
    const testing = std.testing;

    const cfg = AdapterConfig{};
    try testing.expectEqualStrings("", cfg.command);
    try testing.expect(!cfg.passthrough);
    try testing.expect(cfg.parse_json);
    try testing.expectEqual(@as(u64, 15000), cfg.timeout_ms);
    try testing.expect(cfg.cwd == null);
    try testing.expect(!cfg.requires_interactive);
}
