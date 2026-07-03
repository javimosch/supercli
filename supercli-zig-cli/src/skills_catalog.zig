// skills_catalog.zig — Skill providers, index management, and SKILL.md scanning.
// Mirrors cli/skills-catalog.js for local_fs/repo_fs/plugin_fs providers.
const std = @import("std");

pub const SkillEntry = struct {
    id: []const u8,
    provider: []const u8,
    name: []const u8,
    description: []const u8 = "",
    source_path: []const u8 = "",
    tags: [][]const u8 = &.{},
};

pub const Provider = struct {
    name: []const u8,
    type: []const u8,
    roots: [][]const u8 = &.{},
    enabled: bool = true,
    plugin_dir: []const u8 = "",
};

fn supercliDir(gpa: std.mem.Allocator, home: []const u8) ![]const u8 {
    return std.fmt.allocPrint(gpa, "{s}/.supercli", .{home});
}

fn providersFile(gpa: std.mem.Allocator, home: []const u8) ![]const u8 {
    const dir = try supercliDir(gpa, home);
    return std.fmt.allocPrint(gpa, "{s}/skills-providers.json", .{dir});
}

fn indexFile(gpa: std.mem.Allocator, home: []const u8) ![]const u8 {
    const dir = try supercliDir(gpa, home);
    return std.fmt.allocPrint(gpa, "{s}/skills-index.json", .{dir});
}

/// Default providers (matches Node.js defaults).
pub fn defaultProviders(gpa: std.mem.Allocator, home: []const u8) ![]Provider {
    var list: std.ArrayList(Provider) = .empty;

    const configs = [_]struct { name: []const u8, sub: []const u8 }{
        .{ .name = "opencode", .sub = ".config/opencode/skills" },
        .{ .name = "codex", .sub = ".config/codex/skills" },
        .{ .name = "windsurf", .sub = ".config/windsurf/skills" },
        .{ .name = "cursor", .sub = ".config/cursor/skills" },
    };
    for (configs) |c| {
        const root = try std.fmt.allocPrint(gpa, "{s}/{s}", .{ home, c.sub });
        const roots = try gpa.alloc([]const u8, 1);
        roots[0] = root;
        try list.append(gpa, .{ .name = c.name, .type = "local_fs", .roots = roots });
    }

    // repo provider (cwd-based, use home as fallback)
    const repo_root = try std.fmt.allocPrint(gpa, "{s}/.agents/skills", .{home});
    const repo_roots = try gpa.alloc([]const u8, 1);
    repo_roots[0] = repo_root;
    try list.append(gpa, .{ .name = "repo", .type = "repo_fs", .roots = repo_roots });

    // supercli provider (bundled skills)
    const sc_root = try std.fmt.allocPrint(gpa, "{s}/ai/supercli/.agents/skills", .{home});
    const sc_roots = try gpa.alloc([]const u8, 1);
    sc_roots[0] = sc_root;
    try list.append(gpa, .{ .name = "supercli", .type = "local_fs", .roots = sc_roots });

    return list.toOwnedSlice(gpa);
}

/// Read providers from file, merged with defaults.
pub fn listProviders(gpa: std.mem.Allocator, io: std.Io, home: []const u8) ![]Provider {
    const defaults = try defaultProviders(gpa, home);

    const pf = try providersFile(gpa, home);
    const content = std.Io.Dir.cwd().readFileAlloc(io, pf, gpa, .unlimited) catch return defaults;

    const parsed = std.json.parseFromSliceLeaky(std.json.Value, gpa, content, .{}) catch return defaults;
    const arr = switch (parsed) {
        .array => parsed.array.items,
        else => return defaults,
    };

    var merged: std.ArrayList(Provider) = .empty;
    for (defaults) |d| try merged.append(gpa, d);

    for (arr) |item| switch (item) {
        .object => |obj| {
            const name = if (obj.get("name")) |v| switch (v) {
                .string => |s| try gpa.dupe(u8, s),
                else => continue,
            } else continue;

            const ptype = if (obj.get("type")) |v| switch (v) {
                .string => |s| try gpa.dupe(u8, s),
                else => "local_fs",
            } else "local_fs";
            const enabled = if (obj.get("enabled")) |v| switch (v) {
                .bool => |b| b,
                else => true,
            } else true;

            // Parse roots array
            var roots: [][]const u8 = &.{};
            if (obj.get("roots")) |rv| switch (rv) {
                .array => |ra| {
                    roots = try gpa.alloc([]const u8, ra.items.len);
                    for (ra.items, 0..) |ri, ri_i| {
                        roots[ri_i] = switch (ri) {
                            .string => |s| try gpa.dupe(u8, s),
                            else => "",
                        };
                    }
                },
                else => {},
            };

            // Parse plugin_dir
            var plugin_dir: []const u8 = "";
            if (obj.get("plugin_dir")) |v| switch (v) {
                .string => |s| plugin_dir = try gpa.dupe(u8, s),
                else => {},
            };

            // Override if exists
            var found = false;
            for (merged.items, 0..) |m, i| {
                if (std.mem.eql(u8, m.name, name)) {
                    found = true;
                    merged.items[i] = .{ .name = name, .type = ptype, .roots = roots, .enabled = enabled, .plugin_dir = plugin_dir };
                    break;
                }
            }
            if (!found) {
                try merged.append(gpa, .{ .name = name, .type = ptype, .roots = roots, .enabled = enabled, .plugin_dir = plugin_dir });
            }
        },
        else => {},
    };

    return merged.toOwnedSlice(gpa);
}

/// Walk a directory recursively, collecting SKILL.md file paths.
fn walkDir(gpa: std.mem.Allocator, io: std.Io, dir_path: []const u8, list: *std.ArrayList([]const u8)) !void {
    var dir = std.Io.Dir.cwd().openDir(io, dir_path, .{ .iterate = true }) catch return;
    defer dir.close(io);

    var iter = dir.iterate();
    while (try iter.next(io)) |entry| {
        if (entry.kind == .directory) {
            const sub = try std.fmt.allocPrint(gpa, "{s}/{s}", .{ dir_path, entry.name });
            try walkDir(gpa, io, sub, list);
        } else if (entry.kind == .file and std.mem.eql(u8, entry.name, "SKILL.md")) {
            const full = try std.fmt.allocPrint(gpa, "{s}/{s}", .{ dir_path, entry.name });
            try list.append(gpa, full);
        }
    }
}

/// Parse YAML frontmatter from SKILL.md markdown.
fn parseFrontmatter(gpa: std.mem.Allocator, markdown: []const u8) !struct { name: []const u8, description: []const u8 } {
    var name: []const u8 = "";
    var description: []const u8 = "";

    // Check for --- prefix
    if (!std.mem.startsWith(u8, markdown, "---\n")) return .{ .name = name, .description = description };

    // Find closing ---
    const end_marker = "\n---\n";
    const end_pos = std.mem.indexOfPos(u8, markdown, 4, end_marker) orelse return .{ .name = name, .description = description };
    const raw = markdown[4..end_pos];

    var line_iter = std.mem.tokenizeAny(u8, raw, "\n");
    while (line_iter.next()) |line| {
        const colon = std.mem.indexOf(u8, line, ":") orelse continue;
        const key = std.mem.trim(u8, line[0..colon], " ");
        const value_raw = std.mem.trim(u8, line[colon + 1 ..], " ");
        // Strip surrounding quotes
        var value = value_raw;
        if (value.len >= 2 and value[0] == '"' and value[value.len - 1] == '"') {
            value = value[1 .. value.len - 1];
        }
        if (std.mem.eql(u8, key, "skill_name") or std.mem.eql(u8, key, "name")) {
            name = try gpa.dupe(u8, value);
        } else if (std.mem.eql(u8, key, "description")) {
            description = try gpa.dupe(u8, value);
        }
    }

    // Fallback: find first # heading in body
    if (name.len == 0) {
        const body = markdown[end_pos + end_marker.len ..];
        var body_iter = std.mem.tokenizeAny(u8, body, "\n");
        while (body_iter.next()) |bline| {
            if (std.mem.startsWith(u8, bline, "# ")) {
                name = try gpa.dupe(u8, std.mem.trim(u8, bline[2..], " "));
                break;
            }
        }
    }

    return .{ .name = name, .description = description };
}

/// Derive skill ID from file path relative to root.
fn deriveSkillId(gpa: std.mem.Allocator, file_path: []const u8, root: []const u8) ![]const u8 {
    // Remove root prefix and /SKILL.md suffix
    var rel = file_path;
    if (std.mem.startsWith(u8, rel, root)) {
        rel = rel[root.len..];
        if (rel.len > 0 and rel[0] == '/') rel = rel[1..];
    }
    // Remove trailing /SKILL.md
    if (std.mem.endsWith(u8, rel, "/SKILL.md")) {
        rel = rel[0 .. rel.len - "/SKILL.md".len];
    } else if (std.mem.endsWith(u8, rel, "SKILL.md")) {
        rel = rel[0 .. rel.len - "SKILL.md".len];
    }
    // Replace / with .
    const result = try gpa.alloc(u8, rel.len);
    for (rel, 0..) |c, i| {
        result[i] = if (c == '.') '-' else c;
    }
    // Now replace / with .
    for (result, 0..) |c, i| {
        if (c == '/') result[i] = '.';
    }
    return result;
}

/// Sync catalog: scan all enabled providers for SKILL.md files, build index.
pub fn syncCatalog(gpa: std.mem.Allocator, io: std.Io, home: []const u8) !struct { skills: []SkillEntry, providers: [][]const u8 } {
    const providers = try listProviders(gpa, io, home);

    var skills: std.ArrayList(SkillEntry) = .empty;
    var provider_names: std.ArrayList([]const u8) = .empty;

    for (providers) |provider| {
        if (!provider.enabled) continue;
        try provider_names.append(gpa, provider.name);

        // For local_fs and repo_fs: scan roots
        for (provider.roots) |root| {
            var files: std.ArrayList([]const u8) = .empty;
            try walkDir(gpa, io, root, &files);

            for (files.items) |file_path| {
                const content = std.Io.Dir.cwd().readFileAlloc(io, file_path, gpa, .unlimited) catch continue;
                const fm = try parseFrontmatter(gpa, content);

                const base_id = try deriveSkillId(gpa, file_path, root);
                const id = try std.fmt.allocPrint(gpa, "{s}:{s}", .{ provider.name, base_id });

                try skills.append(gpa, .{
                    .id = id,
                    .provider = provider.name,
                    .name = if (fm.name.len > 0) fm.name else base_id,
                    .description = fm.description,
                    .source_path = file_path,
                });
            }
        }
    }

    // Write index file
    const idx_path = try indexFile(gpa, home);
    var out: std.Io.Writer.Allocating = .init(gpa);
    defer out.deinit();
    var jw: std.json.Stringify = .{ .writer = &out.writer, .options = .{ .whitespace = .indent_2 } };
    try jw.beginObject();
    try jw.objectField("version");
    try jw.write(1);
    try jw.objectField("updated_at");
    try jw.write(null);
    try jw.objectField("providers");
    try jw.beginArray();
    for (provider_names.items) |pn| try jw.write(pn);
    try jw.endArray();
    try jw.objectField("skills");
    try jw.beginArray();
    for (skills.items) |s| {
        try jw.beginObject();
        try jw.objectField("id");
        try jw.write(s.id);
        try jw.objectField("provider");
        try jw.write(s.provider);
        try jw.objectField("name");
        try jw.write(s.name);
        try jw.objectField("description");
        try jw.write(s.description);
        try jw.objectField("source_path");
        try jw.write(s.source_path);
        try jw.endObject();
    }
    try jw.endArray();
    try jw.endObject();

    try std.Io.Dir.cwd().writeFile(io, .{ .sub_path = idx_path, .data = out.written() });

    return .{ .skills = try skills.toOwnedSlice(gpa), .providers = try provider_names.toOwnedSlice(gpa) };
}

/// Read the skills index file.
pub fn readIndex(gpa: std.mem.Allocator, io: std.Io, home: []const u8) ![]SkillEntry {
    const idx_path = try indexFile(gpa, home);
    const content = std.Io.Dir.cwd().readFileAlloc(io, idx_path, gpa, .unlimited) catch return &.{};

    const parsed = std.json.parseFromSliceLeaky(std.json.Value, gpa, content, .{}) catch return &.{};
    const root = switch (parsed) {
        .object => parsed.object,
        else => return &.{},
    };

    const skills_arr = root.get("skills") orelse return &.{};
    const arr = switch (skills_arr) {
        .array => skills_arr.array.items,
        else => return &.{},
    };

    var list: std.ArrayList(SkillEntry) = .empty;
    for (arr) |item| switch (item) {
        .object => |obj| {
            const id = if (obj.get("id")) |v| switch (v) {
                .string => |s| try gpa.dupe(u8, s),
                else => continue,
            } else continue;
            const provider = if (obj.get("provider")) |v| switch (v) {
                .string => |s| try gpa.dupe(u8, s),
                else => "",
            } else "";
            const name = if (obj.get("name")) |v| switch (v) {
                .string => |s| try gpa.dupe(u8, s),
                else => "",
            } else "";
            const description = if (obj.get("description")) |v| switch (v) {
                .string => |s| try gpa.dupe(u8, s),
                else => "",
            } else "";
            const source_path = if (obj.get("source_path")) |v| switch (v) {
                .string => |s| try gpa.dupe(u8, s),
                else => "",
            } else "";

            try list.append(gpa, .{
                .id = id,
                .provider = provider,
                .name = name,
                .description = description,
                .source_path = source_path,
            });
        },
        else => {},
    };

    return list.toOwnedSlice(gpa);
}

/// Search catalog skills by query substring (case-insensitive).
pub fn searchCatalog(gpa: std.mem.Allocator, io: std.Io, home: []const u8, query: []const u8) ![]SkillEntry {
    const all = try readIndex(gpa, io, home);
    if (query.len == 0) return all;

    const q_lower = try std.ascii.allocLowerString(gpa, query);
    defer gpa.free(q_lower);

    var filtered: std.ArrayList(SkillEntry) = .empty;
    for (all) |s| {
        const id_lower = try std.ascii.allocLowerString(gpa, s.id);
        defer gpa.free(id_lower);
        const name_lower = try std.ascii.allocLowerString(gpa, s.name);
        defer gpa.free(name_lower);
        const desc_lower = try std.ascii.allocLowerString(gpa, s.description);
        defer gpa.free(desc_lower);

        if (std.mem.indexOf(u8, id_lower, q_lower) != null or
            std.mem.indexOf(u8, name_lower, q_lower) != null or
            std.mem.indexOf(u8, desc_lower, q_lower) != null)
        {
            try filtered.append(gpa, s);
        }
    }
    return filtered.toOwnedSlice(gpa);
}

/// Get a specific skill by provider:id format.
pub fn getCatalogSkill(gpa: std.mem.Allocator, io: std.Io, home: []const u8, skill_id: []const u8) !?struct { entry: SkillEntry, markdown: []const u8 } {
    const all = try readIndex(gpa, io, home);
    for (all) |s| {
        if (std.mem.eql(u8, s.id, skill_id)) {
            if (s.source_path.len > 0) {
                const content = std.Io.Dir.cwd().readFileAlloc(io, s.source_path, gpa, .unlimited) catch return null;
                return .{ .entry = s, .markdown = content };
            }
            return null;
        }
    }
    return null;
}
