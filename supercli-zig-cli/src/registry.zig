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
};

// Read and return all plugins from a plugins directory.
// The caller owns the returned slice (arena-allocated).
pub fn discoverPluginsInDir(
    io: std.Io,
    gpa: std.mem.Allocator,
    plugins_dir_path: []const u8,
) ![]RegistryPlugin {
    var list: std.ArrayList(RegistryPlugin) = .empty;

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

        try list.append(gpa, RegistryPlugin{
            .name = name,
            .description = description,
            .tags = tags,
            .has_learn = has_learn,
            .manifest_path = manifest_path,
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
