// test_helpers.zig — shared utilities for handler tests.
//
// Provides:
//   - OutputCapture: installs output.zig capture sinks so handlers can be
//     invoked and their stdout/stderr inspected.
//   - buildLock: construct a config.Lock from a slice of (name, commands) pairs
//     using an arena allocator, mirroring the pattern used across config.zig
//     tests.
//
// This module is only referenced from `test` blocks, so it adds no production
// code weight.

const std = @import("std");
const output = @import("output.zig");
const config = @import("config.zig");

// Monotonic counter to disambiguate temp homes created within the same
// millisecond.
var tmp_counter: u64 = 0;

/// RAII guard for output capture. The caller must:
///   1. declare `var cap = th.OutputCapture{ .alloc = gpa };`
///   2. call `cap.install()` to route output into cap.out / cap.err
///   3. `defer cap.release()`
/// `install()` must run after the struct is in its final storage location,
/// because captureForTests stores pointers to cap.out / cap.err.
pub const OutputCapture = struct {
    out: std.ArrayList(u8) = .empty,
    err: std.ArrayList(u8) = .empty,
    alloc: std.mem.Allocator,
    guard: ?output.CaptureGuard = null,

    pub fn install(self: *OutputCapture) void {
        std.debug.assert(self.guard == null);
        self.guard = output.captureForTests(self.alloc, &self.out, &self.err);
    }

    pub fn release(self: *OutputCapture) void {
        if (self.guard) |g| g.release();
        self.out.deinit(self.alloc);
        self.err.deinit(self.alloc);
    }

    /// Captured stdout bytes.
    pub fn stdout(self: *const OutputCapture) []const u8 {
        return self.out.items;
    }

    /// Captured stderr bytes.
    pub fn stderr(self: *const OutputCapture) []const u8 {
        return self.err.items;
    }
};

/// Build a Lock owning the given plugins. Each plugin is (name, commands).
/// The lock's arena is created from `alloc`; the caller must `deinit` the
/// returned lock.
pub fn buildLock(
    alloc: std.mem.Allocator,
    plugins: []const struct { name: []const u8, commands: []const config.Command },
) !config.Lock {
    var arena = std.heap.ArenaAllocator.init(alloc);
    const gpa = arena.allocator();
    var plugin_list = try gpa.alloc(config.Plugin, plugins.len);
    for (plugins, 0..) |p, i| {
        const cmds = try gpa.alloc(config.Command, p.commands.len);
        for (p.commands, 0..) |c, j| {
            cmds[j] = .{
                .namespace = try gpa.dupe(u8, c.namespace),
                .resource = try gpa.dupe(u8, c.resource),
                .action = try gpa.dupe(u8, c.action),
                .description = try gpa.dupe(u8, c.description),
                .adapter = try gpa.dupe(u8, c.adapter),
            };
        }
        plugin_list[i] = .{
            .name = try gpa.dupe(u8, p.name),
            .commands = cmds,
        };
    }
    return config.Lock{
        .plugins = plugin_list,
        .arena = arena,
    };
}

/// Parse captured stdout as JSON. Caller owns the returned Value.
pub fn parseJson(alloc: std.mem.Allocator, bytes: []const u8) !std.json.Parsed(std.json.Value) {
    return std.json.parseFromSlice(std.json.Value, alloc, bytes, .{});
}

/// Create a unique temporary home directory for a test, including the
/// `.supercli/plugins` subdirectory. Returns the absolute path (owned by
/// `alloc`). Caller must `removeTempHome` to clean up.
pub fn createTempHome(alloc: std.mem.Allocator, prefix: []const u8) ![]const u8 {
    var threaded = std.Io.Threaded.init(alloc, .{});
    defer threaded.deinit();
    const io = threaded.io();

    // Build a unique suffix from the current time (ms) + a static counter so
    // concurrent/sequential calls don't collide.
    const now = std.Io.Timestamp.now(io, .real).toMilliseconds();
    const path = try std.fmt.allocPrint(alloc, "/tmp/sc-zig-test-{s}-{d}-{d}", .{ prefix, now, tmp_counter });
    tmp_counter +%= 1;

    // Create the directory tree: <home>/.supercli/plugins
    std.Io.Dir.createDirAbsolute(io, path, .default_dir) catch |err| switch (err) {
        error.PathAlreadyExists => {},
        else => return err,
    };
    const supercli = try std.fmt.allocPrint(alloc, "{s}/.supercli", .{path});
    defer alloc.free(supercli);
    std.Io.Dir.createDirAbsolute(io, supercli, .default_dir) catch |err| switch (err) {
        error.PathAlreadyExists => {},
        else => return err,
    };
    const plugins = try std.fmt.allocPrint(alloc, "{s}/plugins", .{supercli});
    defer alloc.free(plugins);
    std.Io.Dir.createDirAbsolute(io, plugins, .default_dir) catch |err| switch (err) {
        error.PathAlreadyExists => {},
        else => return err,
    };
    return path;
}

/// Recursively remove a temporary home directory created by `createTempHome`.
pub fn removeTempHome(alloc: std.mem.Allocator, path: []const u8) void {
    var threaded = std.Io.Threaded.init(alloc, .{});
    defer threaded.deinit();
    const io = threaded.io();
    // Recursive delete of the .supercli tree, then the home dir itself.
    const supercli = std.fmt.allocPrint(alloc, "{s}/.supercli", .{path}) catch return;
    defer alloc.free(supercli);
    std.Io.Dir.cwd().deleteTree(io, supercli) catch {};
    std.Io.Dir.deleteDirAbsolute(io, path) catch {};
}

/// Construct a `std.Io` for use in handler calls. Caller must `deinit` the
/// returned Threaded.
pub fn makeIo(alloc: std.mem.Allocator) std.Io.Threaded {
    return std.Io.Threaded.init(alloc, .{});
}

/// Create a bundled plugin manifest at `<home>/.supercli/plugins/bundled/<name>/plugin.json`
/// with the given JSON content. Creates intermediate directories as needed.
pub fn writeBundledPlugin(
    alloc: std.mem.Allocator,
    io: std.Io,
    home: []const u8,
    plugin_name: []const u8,
    manifest_json: []const u8,
) !void {
    const dir_path = try std.fmt.allocPrint(alloc, "{s}/.supercli/plugins/bundled/{s}", .{ home, plugin_name });
    defer alloc.free(dir_path);
    // Create nested dirs (bundled, then plugin_name).
    const bundled_path = try std.fmt.allocPrint(alloc, "{s}/.supercli/plugins/bundled", .{home});
    defer alloc.free(bundled_path);
    std.Io.Dir.createDirAbsolute(io, bundled_path, .default_dir) catch |err| switch (err) {
        error.PathAlreadyExists => {},
        else => return err,
    };
    std.Io.Dir.createDirAbsolute(io, dir_path, .default_dir) catch |err| switch (err) {
        error.PathAlreadyExists => {},
        else => return err,
    };
    const file_path = try std.fmt.allocPrint(alloc, "{s}/plugin.json", .{dir_path});
    defer alloc.free(file_path);
    std.Io.Dir.cwd().writeFile(io, .{ .sub_path = file_path, .data = manifest_json }) catch |err| return err;
}


