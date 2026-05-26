// update.zig — `plugins update` command.
// Mirrors cli/plugins-update.js: fetch catalog, diff, download tarball, extract.
// Uses curl + tar subprocesses (same as the Node.js implementation).
const std = @import("std");

pub const GITHUB_REPO = "javimosch/supercli";
pub const CATALOG_URL = "https://raw.githubusercontent.com/javimosch/supercli/master/plugins/catalog.json";
pub const TARBALL_URL = "https://github.com/javimosch/supercli/archive/refs/heads/master.tar.gz";

pub const UpdateOptions = struct {
    check_only: bool = false,
    force: bool = false,
    home: []const u8,
};

pub const UpdateResult = struct {
    remote_count: usize = 0,
    added: usize = 0,
    changed: usize = 0,
    unchanged: usize = 0,
    updated: [][]const u8 = &.{},
    check_only: bool = false,
    up_to_date: bool = false,
};

fn remoteDir(gpa: std.mem.Allocator, home: []const u8) ![]const u8 {
    return std.fmt.allocPrint(gpa, "{s}/.supercli/plugins/bundled", .{home});
}

fn catalogFile(gpa: std.mem.Allocator, home: []const u8) ![]const u8 {
    return std.fmt.allocPrint(gpa, "{s}/.supercli/plugins/remote-catalog.json", .{home});
}

fn ensureDir(io: std.Io, path: []const u8) !void {
    std.Io.Dir.createDirAbsolute(io, path, .default_dir) catch |err| switch (err) {
        error.PathAlreadyExists => {},
        else => return err,
    };
}

// Fetch catalog JSON using curl
fn fetchCatalog(io: std.Io, gpa: std.mem.Allocator) ![]const u8 {
    const result = try std.process.run(gpa, io, .{
        .argv = &[_][]const u8{
            "curl", "-fsSL", "--max-time", "15", CATALOG_URL,
        },
        .stdout_limit = .unlimited,
        .stderr_limit = .unlimited,
    });
    const exit_code: u8 = switch (result.term) {
        .exited => |c| c,
        else => 1,
    };
    if (exit_code != 0) {
        return error.CurlFailed;
    }
    return result.stdout;
}

// Diff local catalog vs remote catalog; return (added, changed, unchanged)
const CatalogDiff = struct {
    added: [][]const u8,
    changed: [][]const u8,
    unchanged: [][]const u8,
};

fn diffCatalogs(
    gpa: std.mem.Allocator,
    local_content: ?[]const u8,
    remote_parsed: std.json.Value,
) !CatalogDiff {
    var local_map = std.StringHashMap([]const u8).init(gpa);
    defer local_map.deinit();

    if (local_content) |lc| {
        if (std.json.parseFromSliceLeaky(std.json.Value, gpa, lc, .{})) |lp| {
            if (lp == .object) {
                if (lp.object.get("plugins")) |pv| if (pv == .array) {
                    for (pv.array.items) |item| {
                        if (item != .object) continue;
                        const n = item.object.get("name") orelse continue;
                        const cs = item.object.get("checksum") orelse continue;
                        if (n == .string and cs == .string) {
                            try local_map.put(n.string, cs.string);
                        }
                    }
                };
            }
        } else |_| {}
    }

    var added: std.ArrayList([]const u8) = .empty;
    var changed: std.ArrayList([]const u8) = .empty;
    var unchanged: std.ArrayList([]const u8) = .empty;

    const remote_plugins = switch (remote_parsed) {
        .object => |o| o.get("plugins") orelse return CatalogDiff{
            .added = &.{}, .changed = &.{}, .unchanged = &.{},
        },
        else => return CatalogDiff{ .added = &.{}, .changed = &.{}, .unchanged = &.{} },
    };

    switch (remote_plugins) {
        .array => |arr| {
            for (arr.items) |item| {
                if (item != .object) continue;
                const n = item.object.get("name") orelse continue;
                const cs = item.object.get("checksum") orelse continue;
                if (n != .string or cs != .string) continue;
                if (local_map.get(n.string)) |local_cs| {
                    if (std.mem.eql(u8, local_cs, cs.string)) {
                        try unchanged.append(gpa, try gpa.dupe(u8, n.string));
                    } else {
                        try changed.append(gpa, try gpa.dupe(u8, n.string));
                    }
                } else {
                    try added.append(gpa, try gpa.dupe(u8, n.string));
                }
            }
        },
        else => {},
    }

    return CatalogDiff{
        .added = try added.toOwnedSlice(gpa),
        .changed = try changed.toOwnedSlice(gpa),
        .unchanged = try unchanged.toOwnedSlice(gpa),
    };
}

// Download tarball to tmpdir using curl
fn downloadTarball(io: std.Io, gpa: std.mem.Allocator, tar_path: []const u8) !void {
    const result = try std.process.run(gpa, io, .{
        .argv = &[_][]const u8{
            "curl", "-fsSL", "--max-time", "120", "-o", tar_path, TARBALL_URL,
        },
        .stdout_limit = .unlimited,
        .stderr_limit = .unlimited,
    });
    const exit_code: u8 = switch (result.term) {
        .exited => |c| c,
        else => 1,
    };
    if (exit_code != 0) return error.CurlFailed;
}

// Extract selected plugins from tarball using tar
fn extractPlugins(
    io: std.Io,
    gpa: std.mem.Allocator,
    tar_path: []const u8,
    plugin_names: []const []const u8,
    dest_dir: []const u8,
) !void {
    // Process in batches of 200 to avoid arg limits
    const BATCH = 200;
    var i: usize = 0;
    while (i < plugin_names.len) : (i += BATCH) {
        const end = @min(i + BATCH, plugin_names.len);
        const batch = plugin_names[i..end];

        var argv: std.ArrayList([]const u8) = .empty;
        try argv.appendSlice(gpa, &[_][]const u8{
            "tar", "-xzf", tar_path, "-C", dest_dir, "--strip-components=2",
        });
        for (batch) |name| {
            try argv.append(gpa, try std.fmt.allocPrint(gpa, "supercli-master/plugins/{s}", .{name}));
        }

        const result = try std.process.run(gpa, io, .{
            .argv = argv.items,
            .stdout_limit = .unlimited,
            .stderr_limit = .unlimited,
        });
        const exit_code: u8 = switch (result.term) {
            .exited => |c| c,
            else => 2,
        };
        // exit 2 = some paths not found, which is acceptable
        if (exit_code != 0 and exit_code != 2) return error.TarFailed;
    }
}

// Main update entry point
pub fn updatePlugins(
    io: std.Io,
    gpa: std.mem.Allocator,
    opts: UpdateOptions,
) !UpdateResult {
    const cat_file = try catalogFile(gpa, opts.home);
    const remote_dir = try remoteDir(gpa, opts.home);

    // Fetch remote catalog
    const remote_content = try fetchCatalog(io, gpa);
    const remote_parsed = try std.json.parseFromSliceLeaky(std.json.Value, gpa, remote_content, .{});

    // Count remote plugins
    var remote_count: usize = 0;
    if (remote_parsed == .object) {
        if (remote_parsed.object.get("plugins")) |pv| if (pv == .array) {
            remote_count = pv.array.items.len;
        };
    }

    // Read local catalog
    const local_content: ?[]const u8 = if (!opts.force) blk: {
        break :blk std.Io.Dir.cwd().readFileAlloc(io, cat_file, gpa, .unlimited) catch null;
    } else null;

    const diff = try diffCatalogs(gpa, local_content, remote_parsed);

    var to_update: std.ArrayList([]const u8) = .empty;
    for (diff.added) |n| try to_update.append(gpa, n);
    for (diff.changed) |n| try to_update.append(gpa, n);
    const to_update_slice = try to_update.toOwnedSlice(gpa);

    const result = UpdateResult{
        .remote_count = remote_count,
        .added = diff.added.len,
        .changed = diff.changed.len,
        .unchanged = diff.unchanged.len,
        .updated = to_update_slice,
        .check_only = opts.check_only,
        .up_to_date = to_update_slice.len == 0,
    };

    if (opts.check_only or to_update_slice.len == 0) {
        return result;
    }

    // Ensure remote-bundled dir exists
    try ensureDir(io, remote_dir);

    // Download tarball to a temp path
    const tmp_dir = try std.fmt.allocPrint(gpa, "/tmp/supercli-update-{d}", .{std.Io.Timestamp.now(io, .real).toMilliseconds()});
    ensureDir(io, tmp_dir) catch {};
    const tar_path = try std.fmt.allocPrint(gpa, "{s}/supercli-master.tar.gz", .{tmp_dir});

    try downloadTarball(io, gpa, tar_path);
    try extractPlugins(io, gpa, tar_path, to_update_slice, remote_dir);

    // Clean up temp dir
    std.Io.Dir.cwd().deleteTree(io, tmp_dir) catch {};

    // Write updated catalog
    std.Io.Dir.cwd().writeFile(io, .{
        .sub_path = cat_file,
        .data = remote_content,
    }) catch {};

    return result;
}
