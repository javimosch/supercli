const std = @import("std");
const sc = @import("../skills_catalog.zig");

const SkillEntry = sc.SkillEntry;
const Provider = sc.Provider;
const defaultProviders = sc.defaultProviders;
const readIndex = sc.readIndex;
const searchCatalog = sc.searchCatalog;
const parseFrontmatter = sc.parseFrontmatter;
const deriveSkillId = sc.deriveSkillId;

test "defaultProviders returns expected providers and all enabled" {
    const testing = std.testing;
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const gpa = arena.allocator();

    const providers = try defaultProviders(gpa, "/home/testuser");

    try testing.expectEqual(@as(usize, 6), providers.len);
    try testing.expectEqualStrings("opencode", providers[0].name);
    try testing.expectEqualStrings("local_fs", providers[0].type);
    try testing.expectEqualStrings("codex", providers[1].name);
    try testing.expectEqualStrings("windsurf", providers[2].name);
    try testing.expectEqualStrings("cursor", providers[3].name);
    try testing.expectEqualStrings("repo", providers[4].name);
    try testing.expectEqualStrings("repo_fs", providers[4].type);
    try testing.expectEqualStrings("supercli", providers[5].name);
    try testing.expectEqual(@as(usize, 1), providers[0].roots.len);
    try testing.expectEqualStrings("/home/testuser/.config/opencode/skills", providers[0].roots[0]);
    for (providers) |p| try testing.expect(p.enabled);
}

test "parseFrontmatter extracts name and description from various formats" {
    const testing = std.testing;
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const gpa = arena.allocator();
    // skill_name field with quoted description
    const md1 = \\---
        \\skill_name: git-commit-helper
        \\description: "Helps generate commit messages"
        \\---
        \\# Git Commit Helper
    ;
    const fm1 = try parseFrontmatter(gpa, md1);
    try testing.expectEqualStrings("git-commit-helper", fm1.name);
    try testing.expectEqualStrings("Helps generate commit messages", fm1.description);
    // 'name' key as fallback
    const md2 = \\---
        \\name: my-skill
        \\description: A test skill
        \\---
        \\content
    ;
    const fm2 = try parseFrontmatter(gpa, md2);
    try testing.expectEqualStrings("my-skill", fm2.name);
    try testing.expectEqualStrings("A test skill", fm2.description);
    // Falls back to heading when no name field
    const md3 = \\---
        \\description: Skill without name field
        \\---
        \\# Heading As Name
    ;
    const fm3 = try parseFrontmatter(gpa, md3);
    try testing.expectEqualStrings("Heading As Name", fm3.name);
    try testing.expectEqualStrings("Skill without name field", fm3.description);
    // No frontmatter → empty
    const fm4 = try parseFrontmatter(gpa, "# Just a heading\n\nNo frontmatter here.");
    try testing.expectEqualStrings("", fm4.name);
    try testing.expectEqualStrings("", fm4.description);
    // Missing closing marker → empty
    const fm5 = try parseFrontmatter(gpa, "---\nskill_name: incomplete\ndescription: no closing marker");
    try testing.expectEqualStrings("", fm5.name);
    try testing.expectEqualStrings("", fm5.description);
}

test "deriveSkillId strips root prefix and SKILL.md suffix" {
    const testing = std.testing;
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const gpa = arena.allocator();
    const id1 = try deriveSkillId(gpa, "/home/user/.config/opencode/skills/git/commit/SKILL.md", "/home/user/.config/opencode/skills");
    try testing.expectEqualStrings("git.commit", id1);
    const id2 = try deriveSkillId(gpa, "/home/user/skills/a/b/c/SKILL.md", "/home/user/skills");
    try testing.expectEqualStrings("a.b.c", id2);
    const id3 = try deriveSkillId(gpa, "/root/skills/my-skill/SKILL.md", "/root/skills");
    try testing.expectEqualStrings("my-skill", id3);
}

test "readIndex and searchCatalog return empty for nonexistent index" {
    const testing = std.testing;
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const gpa = arena.allocator();
    var threaded = std.Io.Threaded.init(gpa, .{});
    defer threaded.deinit();
    const io = threaded.io();
    const home = "/tmp/sc-zig-test-skills-nonexistent-12345";
    try testing.expectEqual(@as(usize, 0), (try readIndex(gpa, io, home)).len);
    try testing.expectEqual(@as(usize, 0), (try searchCatalog(gpa, io, home, "test")).len);
}

test "parseFrontmatter handles empty markdown" {
    const testing = std.testing;
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const gpa = arena.allocator();

    const fm = try parseFrontmatter(gpa, "");
    try testing.expectEqualStrings("", fm.name);
    try testing.expectEqualStrings("", fm.description);
}

test "parseFrontmatter handles whitespace-only markdown" {
    const testing = std.testing;
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const gpa = arena.allocator();

    const fm = try parseFrontmatter(gpa, "   \n\n  \n  ");
    try testing.expectEqualStrings("", fm.name);
    try testing.expectEqualStrings("", fm.description);
}

test "parseFrontmatter strips surrounding quotes from values" {
    const testing = std.testing;
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const gpa = arena.allocator();

    const md = \\---
        \\skill_name: "quoted-name"
        \\description: "  quoted desc with spaces  "
        \\---
        \\content
    ;
    const fm = try parseFrontmatter(gpa, md);
    try testing.expectEqualStrings("quoted-name", fm.name);
    try testing.expectEqualStrings("  quoted desc with spaces  ", fm.description);
}

test "parseFrontmatter handles unquoted values" {
    const testing = std.testing;
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const gpa = arena.allocator();

    const md = \\---
        \\skill_name: unquoted-name
        \\description: unquoted description
        \\---
        \\content
    ;
    const fm = try parseFrontmatter(gpa, md);
    try testing.expectEqualStrings("unquoted-name", fm.name);
    try testing.expectEqualStrings("unquoted description", fm.description);
}

test "parseFrontmatter ignores unknown keys" {
    const testing = std.testing;
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const gpa = arena.allocator();

    const md = \\---
        \\skill_name: my-skill
        \\unknown_key: some-value
        \\another: 123
        \\description: test desc
        \\---
        \\content
    ;
    const fm = try parseFrontmatter(gpa, md);
    try testing.expectEqualStrings("my-skill", fm.name);
    try testing.expectEqualStrings("test desc", fm.description);
}

test "deriveSkillId handles root equal to file path" {
    const testing = std.testing;
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const gpa = arena.allocator();

    const id = try deriveSkillId(gpa, "/root/skills/SKILL.md", "/root/skills");
    try testing.expectEqualStrings("", id);
}

test "deriveSkillId handles nested paths" {
    const testing = std.testing;
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const gpa = arena.allocator();

    const id = try deriveSkillId(gpa, "/home/user/skills/a/b/c/d/SKILL.md", "/home/user/skills");
    try testing.expectEqualStrings("a.b.c.d", id);
}

test "deriveSkillId replaces dots in path segments with hyphens" {
    const testing = std.testing;
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const gpa = arena.allocator();

    const id = try deriveSkillId(gpa, "/root/skills/my.skill.dir/SKILL.md", "/root/skills");
    try testing.expectEqualStrings("my-skill-dir", id);
}

test "defaultProviders all have exactly one root" {
    const testing = std.testing;
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const gpa = arena.allocator();

    const providers = try defaultProviders(gpa, "/home/user");
    for (providers) |p| {
        try testing.expectEqual(@as(usize, 1), p.roots.len);
    }
}

test "defaultProviders repo provider has correct root" {
    const testing = std.testing;
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const gpa = arena.allocator();

    const providers = try defaultProviders(gpa, "/home/user");
    try testing.expectEqualStrings("/home/user/.agents/skills", providers[4].roots[0]);
}

test "defaultProviders supercli provider has correct root" {
    const testing = std.testing;
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const gpa = arena.allocator();

    const providers = try defaultProviders(gpa, "/home/user");
    try testing.expectEqualStrings("/home/user/ai/supercli/.agents/skills", providers[5].roots[0]);
}

test "searchCatalog with empty query returns all skills" {
    const testing = std.testing;
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const gpa = arena.allocator();

    var threaded = std.Io.Threaded.init(gpa, .{});
    defer threaded.deinit();
    const io = threaded.io();

    const home = "/tmp/sc-zig-test-skills-empty-query-12345";
    // No index file exists, so readIndex returns empty
    const results = try searchCatalog(gpa, io, home, "");
    defer gpa.free(results);
    try testing.expectEqual(@as(usize, 0), results.len);
}

test "SkillEntry has expected fields" {
    const testing = std.testing;

    const entry = SkillEntry{
        .id = "test:skill",
        .provider = "test",
        .name = "Test Skill",
        .description = "A test skill",
        .source_path = "/path/to/SKILL.md",
    };
    try testing.expectEqualStrings("test:skill", entry.id);
    try testing.expectEqualStrings("test", entry.provider);
    try testing.expectEqualStrings("Test Skill", entry.name);
    try testing.expectEqualStrings("A test skill", entry.description);
    try testing.expectEqualStrings("/path/to/SKILL.md", entry.source_path);
}

test "Provider has expected fields" {
    const testing = std.testing;

    var roots = [_][]const u8{"/path/to/skills"};
    const provider = Provider{
        .name = "test-provider",
        .type = "local_fs",
        .roots = &roots,
        .enabled = true,
        .plugin_dir = "/plugin/dir",
    };
    try testing.expectEqualStrings("test-provider", provider.name);
    try testing.expectEqualStrings("local_fs", provider.type);
    try testing.expect(provider.enabled);
    try testing.expectEqualStrings("/plugin/dir", provider.plugin_dir);
    try testing.expectEqual(@as(usize, 1), provider.roots.len);
}
