const std = @import("std");
const th = @import("../../test_helpers.zig");
const mod = @import("../../handlers/learn.zig");
const config = @import("../../config.zig");

const handlePluginsLearn = mod.handlePluginsLearn;
const LEARN_MANIFEST = mod.LEARN_MANIFEST;
const META_HAS_LEARN = mod.META_HAS_LEARN;
const SKILL_MD = mod.SKILL_MD;

test "handlePluginsLearn JSON output structure" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var threaded = th.makeIo(gpa);
    defer threaded.deinit();
    const io = threaded.io();

    const home = try th.createTempHome(gpa, "learn-inline");
    defer gpa.free(home);
    defer th.removeTempHome(gpa, home);

    try th.writeBundledPlugin(gpa, io, home, "uuid-cli", LEARN_MANIFEST);

    var cap = th.OutputCapture{ .alloc = gpa };
    cap.install();
    defer cap.release();

    try handlePluginsLearn(io, gpa, .json, "uuid-cli", home);

    const parsed = try th.parseJson(gpa, cap.stdout());
    defer parsed.deinit();

    const root = parsed.value.object;
    try testing.expectEqualStrings("uuid-cli", root.get("name").?.string);
    try testing.expectEqualStrings("uuid-cli", root.get("plugin").?.string);
    // Not in lockfile → installed=false (resolved via bundled fallback).
    try testing.expectEqual(false, root.get("installed").?.bool);
    try testing.expect(root.get("learn_markdown") != null);
    try testing.expectEqualStrings("# UUID CLI", root.get("learn_markdown").?.string[0..10]);
}

test "handlePluginsLearn reads SKILL.md when has_learn is true" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var threaded = th.makeIo(gpa);
    defer threaded.deinit();
    const io = threaded.io();

    const home = try th.createTempHome(gpa, "learn-skill");
    defer gpa.free(home);
    defer th.removeTempHome(gpa, home);

    // Manifest without inline `learn`; meta.json sets has_learn=true.
    const manifest_no_learn =
        \\{"name":"skill-plugin","version":"1.0.0","description":"d","source":"test","commands":[{"namespace":"x","resource":"y","action":"z","description":"d","adapter":"process","args":[]}]}
    ;
    try th.writeBundledPlugin(gpa, io, home, "skill-plugin", manifest_no_learn);

    // Write meta.json next to plugin.json.
    const meta_path = try std.fmt.allocPrint(gpa, "{s}/.supercli/plugins/bundled/skill-plugin/meta.json", .{home});
    defer gpa.free(meta_path);
    std.Io.Dir.cwd().writeFile(io, .{ .sub_path = meta_path, .data = META_HAS_LEARN }) catch return error.IoError;

    // Write skills/quickstart/SKILL.md (create nested dirs manually).
    const skills_dir = try std.fmt.allocPrint(gpa, "{s}/.supercli/plugins/bundled/skill-plugin/skills", .{home});
    defer gpa.free(skills_dir);
    std.Io.Dir.createDirAbsolute(io, skills_dir, .default_dir) catch |err| switch (err) {
        error.PathAlreadyExists => {},
        else => return error.IoError,
    };
    const skill_dir = try std.fmt.allocPrint(gpa, "{s}/quickstart", .{skills_dir});
    defer gpa.free(skill_dir);
    std.Io.Dir.createDirAbsolute(io, skill_dir, .default_dir) catch |err| switch (err) {
        error.PathAlreadyExists => {},
        else => return error.IoError,
    };
    const skill_path = try std.fmt.allocPrint(gpa, "{s}/SKILL.md", .{skill_dir});
    defer gpa.free(skill_path);
    std.Io.Dir.cwd().writeFile(io, .{ .sub_path = skill_path, .data = SKILL_MD }) catch return error.IoError;

    var cap = th.OutputCapture{ .alloc = gpa };
    cap.install();
    defer cap.release();

    try handlePluginsLearn(io, gpa, .json, "skill-plugin", home);

    const parsed = try th.parseJson(gpa, cap.stdout());
    defer parsed.deinit();

    const root = parsed.value.object;
    try testing.expectEqualStrings("skill-plugin", root.get("name").?.string);
    const md = root.get("learn_markdown").?.string;
    try testing.expect(std.mem.indexOf(u8, md, "UUID CLI Quickstart") != null);
}

test "handlePluginsLearn human mode outputs raw markdown" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var threaded = th.makeIo(gpa);
    defer threaded.deinit();
    const io = threaded.io();

    const home = try th.createTempHome(gpa, "learn-human");
    defer gpa.free(home);
    defer th.removeTempHome(gpa, home);

    try th.writeBundledPlugin(gpa, io, home, "uuid-cli", LEARN_MANIFEST);

    var cap = th.OutputCapture{ .alloc = gpa };
    cap.install();
    defer cap.release();

    try handlePluginsLearn(io, gpa, .human, "uuid-cli", home);

    try testing.expect(std.mem.indexOf(u8, cap.stdout(), "# UUID CLI") != null);
}
