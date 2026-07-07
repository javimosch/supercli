// registry.zig — Discover plugins from the bundled plugins/ directory.
// Mirrors the logic in cli/plugins-registry.js (discoverPluginsInDir).
// Reads plugin.json + meta.json from each subdirectory.
const std = @import("std");

pub const RegistryPlugin = struct {
    name: []const u8,
    description: []const u8 = "",
    tags: [][]const u8 = &.{},
    has_learn: bool = false,
    manifest_path: []const u8 = "",
    quality: []const u8 = "", // "recommended", "good", "average", "bad", or ""
};

/// Load quality classifications from quality-classifications.json.
/// Returns a map of plugin name -> quality rating string.
/// Caller owns the returned hashmap.
pub fn loadQualityClassifications(
    io: std.Io,
    gpa: std.mem.Allocator,
    plugins_dir_path: []const u8,
) !std.StringHashMap([]const u8) {
    var map = std.StringHashMap([]const u8).init(gpa);
    // Try the quality-classifications.json in the plugins dir
    const cls_path = try std.fmt.allocPrint(gpa, "{s}/quality-classifications.json", .{plugins_dir_path});
    defer gpa.free(cls_path);
    const content = blk: {
        if (std.Io.Dir.cwd().readFileAlloc(io, cls_path, gpa, .unlimited)) |c| break :blk c else |_| {}
        // Fallback: try adjacent plugins/ dir (dev mode)
        const fallback = try std.fmt.allocPrint(gpa, "plugins/quality-classifications.json", .{});
        defer gpa.free(fallback);
        if (std.Io.Dir.cwd().readFileAlloc(io, fallback, gpa, .unlimited)) |c| break :blk c else |_| {}
        break :blk ""; // No quality file found
    };
    if (content.len == 0) return map;
    const parsed = std.json.parseFromSliceLeaky(std.json.Value, gpa, content, .{}) catch return map;
    const obj = switch (parsed) {
        .object => |o| o,
        else => return map,
    };
    var it = obj.iterator();
    while (it.next()) |entry| {
        const plugin_name = try gpa.dupe(u8, entry.key_ptr.*);
        const rating = blk: {
            const plugin_obj = switch (entry.value_ptr.*) {
                .object => |po| po,
                else => break :blk "",
            };
            const rating_val = plugin_obj.get("rating") orelse break :blk "";
            break :blk switch (rating_val) {
                .string => |s| try gpa.dupe(u8, s),
                else => "",
            };
        };
        try map.put(plugin_name, rating);
    }
    return map;
}

// Read and return all plugins from a plugins directory.
// The caller owns the returned slice (arena-allocated).
pub fn discoverPluginsInDir(
    io: std.Io,
    gpa: std.mem.Allocator,
    plugins_dir_path: []const u8,
) ![]RegistryPlugin {
    var list: std.ArrayList(RegistryPlugin) = .empty;

    // Load quality classifications if available
    var quality_map: ?std.StringHashMap([]const u8) = loadQualityClassifications(io, gpa, plugins_dir_path) catch null;
    defer if (quality_map) |*qm| qm.deinit();

    var dir = std.Io.Dir.cwd().openDir(io, plugins_dir_path, .{ .iterate = true }) catch return list.toOwnedSlice(gpa);
    defer dir.close(io);

    var iter = dir.iterate();
    while (try iter.next(io)) |entry| {
        if (entry.kind != .directory) continue;

        const manifest_path = try std.fmt.allocPrint(gpa, "{s}/{s}/plugin.json", .{ plugins_dir_path, entry.name });

        const manifest_content = std.Io.Dir.cwd().readFileAlloc(io, manifest_path, gpa, .unlimited) catch continue;

        const manifest_parsed = std.json.parseFromSliceLeaky(std.json.Value, gpa, manifest_content, .{}) catch continue;

        const manifest_obj = switch (manifest_parsed) {
            .object => |o| o,
            else => continue,
        };

        // Must have name + commands
        const name_val = manifest_obj.get("name") orelse continue;
        const name = switch (name_val) {
            .string => |s| try gpa.dupe(u8, s),
            else => continue,
        };
        if (manifest_obj.get("commands") == null) continue;

        // Read meta.json if present
        var description: []const u8 = "";
        var tags: [][]const u8 = &.{};
        var has_learn: bool = false;

        const meta_path = try std.fmt.allocPrint(gpa, "{s}/{s}/meta.json", .{ plugins_dir_path, entry.name });
        if (std.Io.Dir.cwd().readFileAlloc(io, meta_path, gpa, .unlimited)) |meta_content| {
            if (std.json.parseFromSliceLeaky(std.json.Value, gpa, meta_content, .{})) |meta_parsed| {
                const meta_obj = switch (meta_parsed) {
                    .object => |o| o,
                    else => null,
                };
                if (meta_obj) |mo| {
                    if (mo.get("description")) |dv| switch (dv) {
                        .string => |s| { description = try gpa.dupe(u8, s); },
                        else => {},
                    };
                    if (mo.get("has_learn")) |lv| switch (lv) {
                        .bool => |b| { has_learn = b; },
                        else => {},
                    };
                    if (mo.get("tags")) |tv| switch (tv) {
                        .array => |arr| {
                            var tag_list: std.ArrayList([]const u8) = .empty;
                            for (arr.items) |tag_val| switch (tag_val) {
                                .string => |s| try tag_list.append(gpa, try gpa.dupe(u8, s)),
                                else => {},
                            };
                            tags = try tag_list.toOwnedSlice(gpa);
                        },
                        else => {},
                    };
                }
            } else |_| {}
        } else |_| {
            // Fallback: description from manifest
            if (manifest_obj.get("description")) |dv| switch (dv) {
                .string => |s| { description = try gpa.dupe(u8, s); },
                else => {},
            };
            // has_learn from manifest.learn presence
            has_learn = manifest_obj.get("learn") != null;
        }

        // Look up quality rating
        const quality = if (quality_map) |qm| (qm.get(name) orelse "") else "";

        try list.append(gpa, RegistryPlugin{
            .name = name,
            .description = description,
            .tags = tags,
            .has_learn = has_learn,
            .manifest_path = manifest_path,
            .quality = if (quality.len > 0) try gpa.dupe(u8, quality) else "",
        });
    }

    return list.toOwnedSlice(gpa);
}

// Filter registry plugins by name/description substring
pub fn filterByName(plugins: []const RegistryPlugin, query: []const u8, gpa: std.mem.Allocator) ![]RegistryPlugin {
    var list: std.ArrayList(RegistryPlugin) = .empty;
    const q_lower = try std.ascii.allocLowerString(gpa, query);
    defer gpa.free(q_lower);
    for (plugins) |p| {
        const name_lower = try std.ascii.allocLowerString(gpa, p.name);
        defer gpa.free(name_lower);
        const desc_lower = try std.ascii.allocLowerString(gpa, p.description);
        defer gpa.free(desc_lower);
        if (std.mem.indexOf(u8, name_lower, q_lower) != null or
            std.mem.indexOf(u8, desc_lower, q_lower) != null)
        {
            try list.append(gpa, p);
        }
    }
    return list.toOwnedSlice(gpa);
}

test "filterByName matches plugin name substring" {
    const testing = std.testing;
    const gpa = testing.allocator;

    const plugins = &[_]RegistryPlugin{
        .{ .name = "agentmemory-cli", .description = "Memory for AI agents", .tags = &.{"memory"} },
        .{ .name = "commiat", .description = "Commit message generator", .tags = &.{"git"} },
        .{ .name = "memory-db", .description = "In-memory database", .tags = &.{"database"} },
    };

    const result = try filterByName(plugins, "memory", gpa);
    defer gpa.free(result);

    try testing.expectEqual(@as(usize, 2), result.len);
    try testing.expectEqualStrings("agentmemory-cli", result[0].name);
    try testing.expectEqualStrings("memory-db", result[1].name);
}

test "filterByName matches description substring" {
    const testing = std.testing;
    const gpa = testing.allocator;

    const plugins = &[_]RegistryPlugin{
        .{ .name = "pg", .description = "PostgreSQL database tool", .tags = &.{"db"} },
        .{ .name = "redis-cli", .description = "Redis cache client", .tags = &.{"cache"} },
        .{ .name = "aws-rds", .description = "AWS Relational Database Service", .tags = &.{"aws"} },
    };

    const result = try filterByName(plugins, "database", gpa);
    defer gpa.free(result);

    try testing.expectEqual(@as(usize, 2), result.len);
    try testing.expectEqualStrings("pg", result[0].name);
    try testing.expectEqualStrings("aws-rds", result[1].name);
}

test "filterByName case insensitive" {
    const testing = std.testing;
    const gpa = testing.allocator;

    const plugins = &[_]RegistryPlugin{
        .{ .name = "GitHub-CLI", .description = "GitHub CLI tool", .tags = &.{"github"} },
        .{ .name = "gitlab", .description = "GitLab API client", .tags = &.{"gitlab"} },
    };

    const result = try filterByName(plugins, "github", gpa);
    defer gpa.free(result);

    try testing.expectEqual(@as(usize, 1), result.len);
    try testing.expectEqualStrings("GitHub-CLI", result[0].name);
}

test "filterByName no match returns empty" {
    const testing = std.testing;
    const gpa = testing.allocator;

    const plugins = &[_]RegistryPlugin{
        .{ .name = "uuid", .description = "UUID generator", .tags = &.{"util"} },
    };

    const result = try filterByName(plugins, "nonexistent", gpa);
    defer gpa.free(result);

    try testing.expectEqual(@as(usize, 0), result.len);
}

test "filterByTag exact match" {
    const testing = std.testing;
    const gpa = testing.allocator;

    const plugins = &[_]RegistryPlugin{
        .{ .name = "agentmemory", .description = "Memory", .tags = &.{"memory", "ai"} },
        .{ .name = "chroma", .description = "Vector DB", .tags = &.{"database", "ai"} },
        .{ .name = "redis", .description = "Cache", .tags = &.{"database", "cache"} },
    };

    const result = try filterByTag(plugins, "ai", gpa);
    defer gpa.free(result);

    try testing.expectEqual(@as(usize, 2), result.len);
    try testing.expectEqualStrings("agentmemory", result[0].name);
    try testing.expectEqualStrings("chroma", result[1].name);
}

test "filterByTag case insensitive" {
    const testing = std.testing;
    const gpa = testing.allocator;

    const plugins = &[_]RegistryPlugin{
        .{ .name = "aws-cli", .description = "AWS", .tags = &.{"AWS", "cloud"} },
        .{ .name = "gcp", .description = "GCP", .tags = &.{"Cloud"} },
    };

    const result = try filterByTag(plugins, "aws", gpa);
    defer gpa.free(result);

    try testing.expectEqual(@as(usize, 1), result.len);
    try testing.expectEqualStrings("aws-cli", result[0].name);
}

test "filterByTag no match returns empty" {
    const testing = std.testing;
    const gpa = testing.allocator;

    const plugins = &[_]RegistryPlugin{
        .{ .name = "uuid", .description = "UUID", .tags = &.{"util"} },
    };

    const result = try filterByTag(plugins, "database", gpa);
    defer gpa.free(result);

    try testing.expectEqual(@as(usize, 0), result.len);
}

test "filterByTag empty tag list" {
    const testing = std.testing;
    const gpa = testing.allocator;

    const plugins = &[_]RegistryPlugin{
        .{ .name = "simple", .description = "Simple tool", .tags = &.{} },
    };

    const result = try filterByTag(plugins, "anything", gpa);
    defer gpa.free(result);

    try testing.expectEqual(@as(usize, 0), result.len);
}

// Filter registry plugins by tag
pub fn filterByTag(plugins: []const RegistryPlugin, tag: []const u8, gpa: std.mem.Allocator) ![]RegistryPlugin {
    var list: std.ArrayList(RegistryPlugin) = .empty;
    const t_lower = try std.ascii.allocLowerString(gpa, tag);
    defer gpa.free(t_lower);
    for (plugins) |p| {
        for (p.tags) |ptag| {
            const ptag_lower = try std.ascii.allocLowerString(gpa, ptag);
            defer gpa.free(ptag_lower);
            if (std.mem.eql(u8, ptag_lower, t_lower)) {
                try list.append(gpa, p);
                break;
            }
        }
    }
    return list.toOwnedSlice(gpa);
}

// Filter registry plugins by quality rating.
// Supports comma-separated values: "recommended,good"
pub fn filterByQuality(plugins: []const RegistryPlugin, quality_query: []const u8, gpa: std.mem.Allocator) ![]RegistryPlugin {
    var list: std.ArrayList(RegistryPlugin) = .empty;
    var iter = std.mem.splitScalar(u8, quality_query, ',');
    var qualities: std.ArrayList([]const u8) = .empty;
    while (iter.next()) |q| {
        const trimmed = std.mem.trim(u8, q, " ");
        if (trimmed.len > 0) try qualities.append(gpa, trimmed);
    }
    for (plugins) |p| {
        if (p.quality.len == 0) continue;
        for (qualities.items) |q| {
            if (std.ascii.eqlIgnoreCase(p.quality, q)) {
                try list.append(gpa, p);
                break;
            }
        }
    }
    return list.toOwnedSlice(gpa);
}
