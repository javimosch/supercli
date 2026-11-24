const std = @import("std");
const th = @import("../../test_helpers.zig");
const mod = @import("../../handlers/help.zig");

const handleHelpJson = mod.handleHelpJson;
const handleHelpHuman = mod.handleHelpHuman;
const handleHelp = mod.handleHelp;

test "help JSON output has expected top-level fields" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var cap = th.OutputCapture{ .alloc = gpa };
    cap.install();
    defer cap.release();

    handleHelp(gpa, .json);

    const parsed = try th.parseJson(gpa, cap.stdout());
    defer parsed.deinit();

    const root = parsed.value.object;
    try testing.expectEqualStrings("SuperCLI (Zig)", root.get("name").?.string);
    try testing.expectEqualStrings("Universal Capability Router for AI Agents", root.get("description").?.string);
    try testing.expectEqualStrings("https://github.com/javimosch/supercli", root.get("repository").?.string);
    try testing.expectEqualStrings("sc-zig", root.get("binary").?.string);

    const core_cmds = root.get("core_commands").?.array;
    try testing.expectEqual(@as(usize, 3), core_cmds.items.len);

    const plugin_mgmt = root.get("plugin_management").?.array;
    try testing.expectEqual(@as(usize, 7), plugin_mgmt.items.len);

    const discovery = root.get("discovery").?.array;
    try testing.expectEqual(@as(usize, 1), discovery.items.len);

    const output_modes = root.get("output_modes").?.array;
    try testing.expectEqual(@as(usize, 3), output_modes.items.len);

    const exit_codes = root.get("exit_codes").?.array;
    try testing.expectEqual(@as(usize, 6), exit_codes.items.len);

    const code0 = exit_codes.items[0].object;
    try testing.expectEqual(@as(i64, 0), code0.get("code").?.integer);
    try testing.expectEqualStrings("success", code0.get("description").?.string);

    const code92 = exit_codes.items[3].object;
    try testing.expectEqual(@as(i64, 92), code92.get("code").?.integer);
    try testing.expectEqualStrings("resource_not_found", code92.get("description").?.string);
}

test "help human output contains usage header" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var cap = th.OutputCapture{ .alloc = gpa };
    cap.install();
    defer cap.release();

    handleHelp(gpa, .human);

    // Human help is plain text; verify it mentions the binary and a command.
    try testing.expect(std.mem.indexOf(u8, cap.stdout(), "sc-zig") != null);
    try testing.expect(std.mem.indexOf(u8, cap.stdout(), "SuperCLI") != null);
}

test "help exit codes are valid and in expected range" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var cap = th.OutputCapture{ .alloc = gpa };
    cap.install();
    defer cap.release();

    handleHelp(gpa, .json);
    const parsed = try th.parseJson(gpa, cap.stdout());
    defer parsed.deinit();

    const exit_codes = parsed.value.object.get("exit_codes").?.array;
    try testing.expectEqual(@as(usize, 6), exit_codes.items.len);
    for (exit_codes.items) |item| {
        const code = item.object.get("code").?.integer;
        try testing.expect(code >= 0);
        try testing.expect(code <= 255);
    }
}
