const std = @import("std");
const th = @import("../../test_helpers.zig");
const mod = @import("../../handlers/onboard.zig");
const config = @import("../../config.zig");

const HARNESS_CONFIGS = mod.HARNESS_CONFIGS;
const ONBOARD_SKILL_MARKDOWN = mod.ONBOARD_SKILL_MARKDOWN;
const handleOnboard = mod.handleOnboard;
const handleOffboard = mod.handleOffboard;
const findHarnessConfig = mod.findHarnessConfig;
const writeSkillFile = mod.writeSkillFile;

test "HARNESS_CONFIGS has expected entries" {
    const testing = std.testing;
    try testing.expectEqual(@as(usize, 5), HARNESS_CONFIGS.len);
    try testing.expectEqualStrings("claude", HARNESS_CONFIGS[0].name);
    try testing.expectEqualStrings("opencode", HARNESS_CONFIGS[1].name);
    try testing.expectEqualStrings("agents", HARNESS_CONFIGS[2].name);
    try testing.expectEqualStrings("cursor", HARNESS_CONFIGS[3].name);
    try testing.expectEqualStrings("windsurf", HARNESS_CONFIGS[4].name);
}

test "HARNESS_CONFIGS have correct skill paths" {
    const testing = std.testing;
    try testing.expectEqualStrings(".claude/skills/supercli/SKILL.md", HARNESS_CONFIGS[0].skill_path);
    try testing.expectEqualStrings(".opencode/skills/supercli/SKILL.md", HARNESS_CONFIGS[1].skill_path);
    try testing.expectEqualStrings(".agents/skills/supercli/SKILL.md", HARNESS_CONFIGS[2].skill_path);
    try testing.expectEqualStrings(".cursor/rules/supercli.mdc", HARNESS_CONFIGS[3].skill_path);
    try testing.expectEqualStrings(".windsurfrules", HARNESS_CONFIGS[4].skill_path);
}

test "findHarnessConfig finds known harnesses" {
    const testing = std.testing;

    const claude = findHarnessConfig("claude");
    try testing.expect(claude != null);
    try testing.expectEqualStrings("claude", claude.?.name);

    const cursor = findHarnessConfig("cursor");
    try testing.expect(cursor != null);
    try testing.expectEqualStrings("cursor", cursor.?.name);

    const windsurf = findHarnessConfig("windsurf");
    try testing.expect(windsurf != null);
    try testing.expectEqualStrings("windsurf", windsurf.?.name);
}

test "findHarnessConfig returns null for unknown harness" {
    const testing = std.testing;

    try testing.expect(findHarnessConfig("nonexistent") == null);
    try testing.expect(findHarnessConfig("") == null);
    try testing.expect(findHarnessConfig("CLAUDE") == null); // case sensitive
}

test "ONBOARD_SKILL_MARKDOWN has frontmatter and content" {
    const testing = std.testing;
    try testing.expect(std.mem.startsWith(u8, ONBOARD_SKILL_MARKDOWN, "---\n"));
    try testing.expect(std.mem.indexOf(u8, ONBOARD_SKILL_MARKDOWN, "skill_name") != null);
    try testing.expect(std.mem.indexOf(u8, ONBOARD_SKILL_MARKDOWN, "supercli") != null);
    try testing.expect(std.mem.indexOf(u8, ONBOARD_SKILL_MARKDOWN, "## Discovery") != null);
    try testing.expect(std.mem.indexOf(u8, ONBOARD_SKILL_MARKDOWN, "## Execution") != null);
    try testing.expect(std.mem.indexOf(u8, ONBOARD_SKILL_MARKDOWN, "## Skills") != null);
}

test "onboard JSON output structure" {
    const testing = std.testing;
    const gpa = testing.allocator;
    var threaded = th.makeIo(gpa);
    defer threaded.deinit();
    const io = threaded.io();
    const home = try th.createTempHome(gpa, "onboard-json");
    defer gpa.free(home);
    defer th.removeTempHome(gpa, home);
    var flags = std.StringHashMap([]const u8).init(gpa);
    defer flags.deinit();
    try flags.put("target", home);
    try flags.put("harness", "claude");
    var cap = th.OutputCapture{ .alloc = gpa };
    cap.install();
    defer cap.release();
    try handleOnboard(io, gpa, .json, flags);
    const parsed = try th.parseJson(gpa, cap.stdout());
    defer parsed.deinit();
    const root = parsed.value.object;
    try testing.expectEqualStrings("onboard", root.get("mode").?.string);
    try testing.expectEqualStrings(home, root.get("target").?.string);
    try testing.expectEqual(false, root.get("dry_run").?.bool);
    const results = root.get("results").?.array;
    try testing.expectEqual(@as(usize, 1), results.items.len);
    const r0 = results.items[0].object;
    try testing.expectEqualStrings("claude", r0.get("harness").?.string);
    try testing.expectEqualStrings(".claude/skills/supercli/SKILL.md", r0.get("path").?.string);
    try testing.expectEqualStrings("installed", r0.get("action").?.string);
}

test "offboard JSON output structure" {
    const testing = std.testing;
    const gpa = testing.allocator;
    var threaded = th.makeIo(gpa);
    defer threaded.deinit();
    const io = threaded.io();
    const home = try th.createTempHome(gpa, "offboard-json");
    defer gpa.free(home);
    defer th.removeTempHome(gpa, home);
    // Install skill file first so dry-run offboard reports "would_remove".
    const skill_path = try std.fmt.allocPrint(gpa, "{s}/.claude/skills/supercli/SKILL.md", .{home});
    defer gpa.free(skill_path);
    try writeSkillFile(io, skill_path, ONBOARD_SKILL_MARKDOWN);
    var flags = std.StringHashMap([]const u8).init(gpa);
    defer flags.deinit();
    try flags.put("target", home);
    try flags.put("harness", "claude");
    try flags.put("dry-run", "");
    var cap = th.OutputCapture{ .alloc = gpa };
    cap.install();
    defer cap.release();
    try handleOffboard(io, gpa, .json, flags);
    const parsed = try th.parseJson(gpa, cap.stdout());
    defer parsed.deinit();
    const root = parsed.value.object;
    try testing.expectEqualStrings("offboard", root.get("mode").?.string);
    try testing.expectEqualStrings(home, root.get("target").?.string);
    try testing.expectEqual(true, root.get("dry_run").?.bool);
    const results = root.get("results").?.array;
    try testing.expectEqual(@as(usize, 1), results.items.len);
    const r0 = results.items[0].object;
    try testing.expectEqualStrings("claude", r0.get("harness").?.string);
    try testing.expectEqualStrings(".claude/skills/supercli/SKILL.md", r0.get("path").?.string);
    try testing.expectEqualStrings("would_remove", r0.get("action").?.string);
}

test "onboard detect JSON output structure" {
    const testing = std.testing;
    const gpa = testing.allocator;
    var threaded = th.makeIo(gpa);
    defer threaded.deinit();
    const io = threaded.io();
    const home = try th.createTempHome(gpa, "onboard-detect");
    defer gpa.free(home);
    defer th.removeTempHome(gpa, home);
    // Create .claude and .cursor subdirs so detectHarnesses finds them.
    inline for (.{ ".claude", ".cursor" }) |sub| {
        const dir_path = try std.fmt.allocPrint(gpa, "{s}/{s}", .{ home, sub });
        defer gpa.free(dir_path);
        std.Io.Dir.createDirAbsolute(io, dir_path, .default_dir) catch |err| switch (err) {
            error.PathAlreadyExists => {},
            else => return err,
        };
    }
    var flags = std.StringHashMap([]const u8).init(gpa);
    defer flags.deinit();
    try flags.put("target", home);
    try flags.put("detect", "");
    var cap = th.OutputCapture{ .alloc = gpa };
    cap.install();
    defer cap.release();
    try handleOnboard(io, gpa, .json, flags);
    const parsed = try th.parseJson(gpa, cap.stdout());
    defer parsed.deinit();
    const root = parsed.value.object;
    try testing.expectEqualStrings("onboard_detect", root.get("mode").?.string);
    try testing.expectEqualStrings(home, root.get("target").?.string);
    const detected = root.get("detected").?.array;
    try testing.expectEqual(@as(usize, 2), detected.items.len);
    try testing.expectEqualStrings("claude", detected.items[0].string);
    try testing.expectEqualStrings("cursor", detected.items[1].string);
}
