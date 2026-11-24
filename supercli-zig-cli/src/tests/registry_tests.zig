const std = @import("std");
const mod = @import("../registry.zig");

const RegistryPlugin = mod.RegistryPlugin;
const loadQualityClassifications = mod.loadQualityClassifications;
const discoverPluginsInDir = mod.discoverPluginsInDir;
const filterByName = mod.filterByName;
const filterByTag = mod.filterByTag;
const filterByQuality = mod.filterByQuality;

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
