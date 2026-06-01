// plugins.zig — bundledPluginsDir, handlePluginsList, handlePluginsUpdate,
//               handlePluginsExplore, handlePluginsInstall
const std = @import("std");
const output = @import("../output.zig");
const config = @import("../config.zig");
const registry = @import("../registry.zig");
const update = @import("../update.zig");

/// Resolve the bundled plugins catalog directory.
/// Primary: ~/.supercli/plugins/bundled/
/// Fallback: adjacent plugins/ dir for dev builds.
pub fn bundledPluginsDir(gpa: std.mem.Allocator, io: std.Io, home: []const u8) ![]const u8 {
    const bundled = try std.fmt.allocPrint(gpa, "{s}/.supercli/plugins/bundled", .{home});
    if (std.Io.Dir.cwd().openDir(io, bundled, .{})) |d| {
        var dd = d;
        dd.close(io);
        return bundled;
    } else |_| {}

    const exe_path = try std.process.executablePathAlloc(io, gpa);
    defer gpa.free(exe_path);
    const exe_dir = std.fs.path.dirname(exe_path) orelse ".";
    const candidates = [_][]const u8{
        try std.fmt.allocPrint(gpa, "{s}/../plugins", .{exe_dir}),
        try std.fmt.allocPrint(gpa, "{s}/../../plugins", .{exe_dir}),
        try std.fmt.allocPrint(gpa, "{s}/../../../plugins", .{exe_dir}),
    };
    for (candidates) |c| {
        if (std.Io.Dir.cwd().openDir(io, c, .{})) |d| {
            var dd = d;
            dd.close(io);
            return c;
        } else |_| {}
    }
    return try gpa.dupe(u8, "plugins");
}

pub fn handlePluginsList(gpa: std.mem.Allocator, lock: *const config.Lock, mode: output.Mode) void {
    if (mode == .human) {
        output.writeLine("\n  Installed Plugins\n");
        for (lock.plugins) |p| {
            var buf: [256]u8 = undefined;
            const line = std.fmt.bufPrint(&buf, "  {s}  v{s}  {s}\n", .{ p.name, p.version, p.description }) catch continue;
            output.writeRaw(line);
        }
        output.writeLine("");
        return;
    }
    var out: std.Io.Writer.Allocating = .init(gpa);
    defer out.deinit();
    var jw: std.json.Stringify = .{ .writer = &out.writer };
    jw.beginObject() catch return;
    jw.objectField("version") catch return;
    jw.write("1.0") catch return;
    jw.objectField("total") catch return;
    jw.write(lock.plugins.len) catch return;
    jw.objectField("plugins") catch return;
    jw.beginArray() catch return;
    for (lock.plugins) |p| {
        jw.beginObject() catch return;
        jw.objectField("name") catch return;
        jw.write(p.name) catch return;
        jw.objectField("version") catch return;
        jw.write(p.version) catch return;
        jw.objectField("description") catch return;
        jw.write(p.description) catch return;
        jw.objectField("commands") catch return;
        jw.write(p.commands.len) catch return;
        jw.endObject() catch return;
    }
    jw.endArray() catch return;
    jw.endObject() catch return;
    output.writeRaw(out.written());
    output.writeRaw("\n");
}

pub fn handlePluginsUpdate(
    io: std.Io,
    gpa: std.mem.Allocator,
    mode: output.Mode,
    flags: std.StringHashMap([]const u8),
    home: []const u8,
) !void {
    const start = std.Io.Timestamp.now(io, .real).toMilliseconds();
    const check_only = flags.contains("check");
    const force = flags.contains("force");

    const result = update.updatePlugins(io, gpa, .{
        .check_only = check_only,
        .force = force,
        .home = home,
    }) catch |err| {
        const msg = switch (err) {
            error.CurlFailed => "Failed to fetch remote catalog. Is curl installed and internet available?",
            error.TarFailed => "Failed to extract plugin archive. Is tar installed?",
            else => "Plugin update failed",
        };
        output.exitWithError(gpa, mode, .{
            .code = 105,
            .err_type = "integration_error",
            .message = msg,
            .recoverable = true,
            .suggestions = &.{"Check internet connection and retry"},
        });
    };

    const duration = std.Io.Timestamp.now(io, .real).toMilliseconds() - start;

    if (mode == .human) {
        if (result.up_to_date) {
            output.writeLine("  Plugins are up to date");
            return;
        }
        var buf: [128]u8 = undefined;
        const s = std.fmt.bufPrint(&buf, "  Updated {d} plugins (+{d} new, ~{d} changed) in {d}ms\n", .{
            result.updated.len, result.added, result.changed, duration,
        }) catch "";
        output.writeRaw(s);
        return;
    }

    var out: std.Io.Writer.Allocating = .init(gpa);
    defer out.deinit();
    var jw: std.json.Stringify = .{ .writer = &out.writer };
    jw.beginObject() catch return;
    jw.objectField("version") catch return;
    jw.write("1.0") catch return;
    jw.objectField("remote_count") catch return;
    jw.write(result.remote_count) catch return;
    jw.objectField("added") catch return;
    jw.write(result.added) catch return;
    jw.objectField("changed") catch return;
    jw.write(result.changed) catch return;
    jw.objectField("unchanged") catch return;
    jw.write(result.unchanged) catch return;
    jw.objectField("updated") catch return;
    jw.write(result.updated.len) catch return;
    jw.objectField("check_only") catch return;
    jw.write(result.check_only) catch return;
    jw.objectField("up_to_date") catch return;
    jw.write(result.up_to_date) catch return;
    jw.objectField("duration_ms") catch return;
    jw.write(duration) catch return;
    jw.endObject() catch return;
    output.writeRaw(out.written());
    output.writeRaw("\n");
}

pub fn handlePluginsExplore(
    io: std.Io,
    gpa: std.mem.Allocator,
    mode: output.Mode,
    flags: std.StringHashMap([]const u8),
    home: []const u8,
) !void {
    const plugins_path = try bundledPluginsDir(gpa, io, home);
    const all_plugins = try registry.discoverPluginsInDir(io, gpa, plugins_path);

    const name_query = flags.get("name") orelse "";
    const tags_query = flags.get("tags") orelse "";
    const installed_only = flags.contains("installed");

    var lock = try config.readLock(io, home, gpa);
    defer lock.deinit();
    var installed_set = std.StringHashMap(bool).init(gpa);
    defer installed_set.deinit();
    for (lock.plugins) |p| try installed_set.put(p.name, true);

    var filtered: []registry.RegistryPlugin = all_plugins;
    if (name_query.len > 0) filtered = try registry.filterByName(filtered, name_query, gpa);
    if (tags_query.len > 0) {
        var tag_iter = std.mem.splitScalar(u8, tags_query, ',');
        while (tag_iter.next()) |tag| {
            const t = std.mem.trim(u8, tag, " ");
            if (t.len > 0) filtered = try registry.filterByTag(filtered, t, gpa);
        }
    }
    if (installed_only) {
        var inst_list: std.ArrayList(registry.RegistryPlugin) = .empty;
        for (filtered) |p| {
            if (installed_set.contains(p.name)) try inst_list.append(gpa, p);
        }
        filtered = try inst_list.toOwnedSlice(gpa);
    }

    if (filtered.len == 0) {
        if (mode == .human) {
            output.writeLine("\n  No plugins found matching your criteria.");
            output.writeLine("  Try running: sc-zig plugins update\n");
            return;
        }
        var out: std.Io.Writer.Allocating = .init(gpa);
        defer out.deinit();
        var jw: std.json.Stringify = .{ .writer = &out.writer };
        jw.beginObject() catch return;
        jw.objectField("version") catch return;
        jw.write("1.0") catch return;
        jw.objectField("total") catch return;
        jw.write(0) catch return;
        jw.objectField("returned") catch return;
        jw.write(0) catch return;
        jw.objectField("plugins") catch return;
        jw.beginArray() catch return;
        jw.endArray() catch return;
        jw.objectField("filters") catch return;
        jw.beginObject() catch return;
        jw.objectField("name") catch return;
        jw.write(name_query) catch return;
        jw.objectField("tags") catch return;
        jw.write(tags_query) catch return;
        jw.endObject() catch return;
        jw.objectField("suggestion") catch return;
        jw.write("Run: sc-zig plugins update") catch return;
        jw.endObject() catch return;
        output.writeRaw(out.written());
        output.writeRaw("\n");
        return;
    }

    const limit: usize = blk: {
        const limit_str = flags.get("limit") orelse "";
        if (limit_str.len == 0) break :blk 0;
        break :blk std.fmt.parseInt(usize, limit_str, 10) catch {
            output.exitWithError(gpa, mode, .{
                .code = 85,
                .err_type = "invalid_argument",
                .message = "Invalid value for --limit flag",
                .recoverable = false,
            });
        };
    };
    const returned_count = if (limit > 0) @min(limit, filtered.len) else filtered.len;

    if (mode == .human) {
        output.writeLine("\n  Plugins\n");
        for (filtered[0..returned_count]) |p| {
            const inst_str = if (installed_set.contains(p.name)) "[installed]" else "";
            var buf: [512]u8 = undefined;
            const line = std.fmt.bufPrint(&buf, "  {s}  {s}  {s}\n", .{ p.name, inst_str, p.description }) catch continue;
            output.writeRaw(line);
        }
        var buf2: [64]u8 = undefined;
        const summary = std.fmt.bufPrint(&buf2, "  Returned: {d}/{d}\n\n", .{ returned_count, filtered.len }) catch "";
        output.writeRaw(summary);
        return;
    }

    var out: std.Io.Writer.Allocating = .init(gpa);
    defer out.deinit();
    var jw: std.json.Stringify = .{ .writer = &out.writer };
    jw.beginObject() catch return;
    jw.objectField("version") catch return;
    jw.write("1.0") catch return;
    jw.objectField("total") catch return;
    jw.write(filtered.len) catch return;
    jw.objectField("returned") catch return;
    jw.write(returned_count) catch return;
    jw.objectField("plugins") catch return;
    jw.beginArray() catch return;
    for (filtered[0..returned_count]) |p| {
        jw.beginObject() catch return;
        jw.objectField("name") catch return;
        jw.write(p.name) catch return;
        jw.objectField("description") catch return;
        jw.write(p.description) catch return;
        jw.objectField("has_learn") catch return;
        jw.write(p.has_learn) catch return;
        jw.objectField("installed") catch return;
        jw.write(installed_set.contains(p.name)) catch return;
        jw.endObject() catch return;
    }
    jw.endArray() catch return;
    jw.objectField("filters") catch return;
    jw.beginObject() catch return;
    jw.objectField("name") catch return;
    jw.write(name_query) catch return;
    jw.objectField("tags") catch return;
    jw.write(tags_query) catch return;
    jw.endObject() catch return;
    jw.endObject() catch return;
    output.writeRaw(out.written());
    output.writeRaw("\n");
}

pub fn handlePluginsInstall(
    io: std.Io,
    gpa: std.mem.Allocator,
    mode: output.Mode,
    plugin_name: []const u8,
) void {
    if (plugin_name.len == 0) {
        output.exitWithError(gpa, mode, .{
            .code = 85,
            .err_type = "invalid_argument",
            .message = "Usage: sc-zig plugins install <name>",
            .recoverable = false,
            .suggestions = &.{"Run: sc-zig plugins explore --name <query>"},
        });
    }
    const sc_cmd = [_][]const u8{ "sc", "plugins", "install", plugin_name };
    const result = std.process.run(gpa, io, .{
        .argv = &sc_cmd,
        .cwd = .inherit,
        .stdout_limit = .unlimited,
        .stderr_limit = .unlimited,
    }) catch {
        output.exitWithError(gpa, mode, .{
            .code = 105,
            .err_type = "integration_error",
            .message = "Failed to run 'sc plugins install'. Is Node.js sc installed?",
            .recoverable = true,
            .suggestions = &.{"Install Node.js version: npm install -g superacli"},
        });
    };
    const exit_code: u8 = switch (result.term) {
        .exited => |c| c,
        else => 1,
    };
    if (exit_code != 0) {
        const msg = if (result.stderr.len > 0)
            gpa.dupe(u8, std.mem.trim(u8, result.stderr, "\n\r ")) catch plugin_name
        else
            std.fmt.allocPrint(gpa, "Plugin install failed (exit {d})", .{exit_code}) catch plugin_name;
        output.exitWithError(gpa, mode, .{
            .code = 105,
            .err_type = "integration_error",
            .message = msg,
            .recoverable = true,
        });
    }
    output.writeRaw(result.stdout);
    if (result.stdout.len > 0 and result.stdout[result.stdout.len - 1] != '\n') {
        output.writeRaw("\n");
    }
}
