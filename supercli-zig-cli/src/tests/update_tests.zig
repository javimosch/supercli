const std = @import("std");
const mod = @import("../update.zig");

const GITHUB_REPO = mod.GITHUB_REPO;
const CATALOG_URL = mod.CATALOG_URL;
const TARBALL_URL = mod.TARBALL_URL;
const UpdateOptions = mod.UpdateOptions;
const UpdateResult = mod.UpdateResult;
const diffCatalogs = mod.diffCatalogs;
const freeCatalogDiff = mod.freeCatalogDiff;
const updatePlugins = mod.updatePlugins;

test "diffCatalogs: all plugins new (no local)" {
    const testing = std.testing;
    const gpa = testing.allocator;

    const remote_json =
        \\{"plugins":[{"name":"uuid","checksum":"abc123"},{"name":"passgen","checksum":"def456"}]}
    ;
    const remote_parsed = try std.json.parseFromSlice(std.json.Value, gpa, remote_json, .{});
    defer remote_parsed.deinit();

    const diff = try diffCatalogs(gpa, null, remote_parsed.value);
    defer freeCatalogDiff(gpa, diff);

    try testing.expectEqual(@as(usize, 2), diff.added.len);
    try testing.expectEqual(@as(usize, 0), diff.changed.len);
    try testing.expectEqual(@as(usize, 0), diff.unchanged.len);
    try testing.expectEqualStrings("uuid", diff.added[0]);
    try testing.expectEqualStrings("passgen", diff.added[1]);
}

test "diffCatalogs: all plugins unchanged" {
    const testing = std.testing;
    const gpa = testing.allocator;

    const local_json =
        \\{"plugins":[{"name":"uuid","checksum":"abc123"},{"name":"passgen","checksum":"def456"}]}
    ;
    const remote_json =
        \\{"plugins":[{"name":"uuid","checksum":"abc123"},{"name":"passgen","checksum":"def456"}]}
    ;
    const remote_parsed = try std.json.parseFromSlice(std.json.Value, gpa, remote_json, .{});
    defer remote_parsed.deinit();

    const diff = try diffCatalogs(gpa, local_json, remote_parsed.value);
    defer freeCatalogDiff(gpa, diff);

    try testing.expectEqual(@as(usize, 0), diff.added.len);
    try testing.expectEqual(@as(usize, 0), diff.changed.len);
    try testing.expectEqual(@as(usize, 2), diff.unchanged.len);
}

test "diffCatalogs: one added, one changed, one unchanged" {
    const testing = std.testing;
    const gpa = testing.allocator;

    const local_json =
        \\{"plugins":[{"name":"old-tool","checksum":"abc"},{"name":"changed-tool","checksum":"old"}]}
    ;
    const remote_json =
        \\{"plugins":[{"name":"new-tool","checksum":"xyz"},{"name":"changed-tool","checksum":"new"},{"name":"old-tool","checksum":"abc"}]}
    ;
    const remote_parsed = try std.json.parseFromSlice(std.json.Value, gpa, remote_json, .{});
    defer remote_parsed.deinit();

    const diff = try diffCatalogs(gpa, local_json, remote_parsed.value);
    defer freeCatalogDiff(gpa, diff);

    try testing.expectEqual(@as(usize, 1), diff.added.len);
    try testing.expectEqualStrings("new-tool", diff.added[0]);
    try testing.expectEqual(@as(usize, 1), diff.changed.len);
    try testing.expectEqualStrings("changed-tool", diff.changed[0]);
    try testing.expectEqual(@as(usize, 1), diff.unchanged.len);
    try testing.expectEqualStrings("old-tool", diff.unchanged[0]);
}

test "diffCatalogs: empty remote catalog" {
    const testing = std.testing;
    const gpa = testing.allocator;

    const local_json =
        \\{"plugins":[{"name":"uuid","checksum":"abc"}]}
    ;
    const remote_json = \\{"plugins":[]}
    ;
    const remote_parsed = try std.json.parseFromSlice(std.json.Value, gpa, remote_json, .{});
    defer remote_parsed.deinit();

    const diff = try diffCatalogs(gpa, local_json, remote_parsed.value);
    defer freeCatalogDiff(gpa, diff);

    try testing.expectEqual(@as(usize, 0), diff.added.len);
    try testing.expectEqual(@as(usize, 0), diff.changed.len);
    try testing.expectEqual(@as(usize, 0), diff.unchanged.len);
}

test "diffCatalogs: remote missing plugins key returns empty diff" {
    const testing = std.testing;
    const gpa = testing.allocator;

    const remote_json = \\{"not_plugins":[]}
    ;
    const remote_parsed = try std.json.parseFromSlice(std.json.Value, gpa, remote_json, .{});
    defer remote_parsed.deinit();

    const diff = try diffCatalogs(gpa, null, remote_parsed.value);
    defer freeCatalogDiff(gpa, diff);

    try testing.expectEqual(@as(usize, 0), diff.added.len);
    try testing.expectEqual(@as(usize, 0), diff.changed.len);
    try testing.expectEqual(@as(usize, 0), diff.unchanged.len);
}

test "diffCatalogs: malformed local catalog handled gracefully" {
    const testing = std.testing;
    const gpa = testing.allocator;

    const remote_json =
        \\{"plugins":[{"name":"uuid","checksum":"abc"}]}
    ;
    const remote_parsed = try std.json.parseFromSlice(std.json.Value, gpa, remote_json, .{});
    defer remote_parsed.deinit();

    const diff = try diffCatalogs(gpa, "not valid json", remote_parsed.value);
    defer freeCatalogDiff(gpa, diff);

    try testing.expectEqual(@as(usize, 1), diff.added.len);
    try testing.expectEqualStrings("uuid", diff.added[0]);
    try testing.expectEqual(@as(usize, 0), diff.changed.len);
    try testing.expectEqual(@as(usize, 0), diff.unchanged.len);
}
