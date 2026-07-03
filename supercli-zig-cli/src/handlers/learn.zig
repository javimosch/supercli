// learn.zig — plugins learn <name>: resolve manifest and output skill markdown
const std = @import("std");
const output = @import("../output.zig");
const lockfile = @import("../lockfile.zig");

const plugins_handler = @import("plugins.zig");

pub fn handlePluginsLearn(
    io: std.Io,
    gpa: std.mem.Allocator,
    mode: output.Mode,
    plugin_name: []const u8,
    home: []const u8,
) !void {
    if (plugin_name.len == 0) {
        output.exitWithError(gpa, mode, .{
            .code = 85,
            .err_type = "invalid_argument",
            .message = "Usage: sc-zig plugins learn <name>",
            .recoverable = false,
            .suggestions = &.{"Run: sc-zig plugins explore --name <query>"},
        });
    }

    var arena = std.heap.ArenaAllocator.init(gpa);
    defer arena.deinit();
    const arena_alloc = arena.allocator();

    // 1. Try installed plugin — get manifest path from resolved_from
    const lock_raw = lockfile.readLockRaw(io, arena_alloc, home) catch null;
    var manifest_path: ?[]const u8 = null;
    var is_installed = false;

    if (lock_raw) |lock| {
        if (lockfile.getPluginEntry(lock, plugin_name)) |entry| {
            is_installed = true;
            if (entry == .object) {
                if (entry.object.get("resolved_from")) |rf| switch (rf) {
                    .object => |rf_obj| {
                        if (rf_obj.get("manifest_path")) |mp| switch (mp) {
                            .string => |s| { manifest_path = try arena_alloc.dupe(u8, s); },
                            else => {},
                        };
                    },
                    else => {},
                };
            }
        }
    }

    // 2. Fallback to bundled registry
    if (manifest_path == null) {
        const plugins_dir = try plugins_handler.bundledPluginsDir(arena_alloc, io, home);
        const bundled_path = try std.fmt.allocPrint(arena_alloc, "{s}/{s}/plugin.json", .{ plugins_dir, plugin_name });
        if (std.Io.Dir.cwd().openFile(io, bundled_path, .{}) catch null) |f| {
            f.close(io);
            manifest_path = bundled_path;
        }
    }

    if (manifest_path == null) {
        output.exitWithError(gpa, mode, .{
            .code = 92,
            .err_type = "resource_not_found",
            .message = "Plugin not found",
            .recoverable = false,
            .suggestions = &.{
                "Run: sc-zig plugins explore --name <query>",
                "Run: sc-zig plugins list",
            },
        });
    }

    // 3. Read manifest
    const manifest_content = std.Io.Dir.cwd().readFileAlloc(io, manifest_path.?, arena_alloc, .unlimited) catch {
        output.exitWithError(gpa, mode, .{
            .code = 92,
            .err_type = "resource_not_found",
            .message = "Failed to read plugin manifest",
            .recoverable = false,
        });
    };
    const manifest_parsed = std.json.parseFromSliceLeaky(std.json.Value, arena_alloc, manifest_content, .{}) catch {
        output.exitWithError(gpa, mode, .{
            .code = 110,
            .err_type = "internal_error",
            .message = "Failed to parse plugin manifest",
            .recoverable = false,
        });
    };
    const manifest_obj = switch (manifest_parsed) {
        .object => |o| o,
        else => output.exitWithError(gpa, mode, .{
            .code = 110,
            .err_type = "internal_error",
            .message = "Invalid manifest format",
            .recoverable = false,
        }),
    };

    // 4. Read meta.json for has_learn
    const manifest_dir = std.fs.path.dirname(manifest_path.?) orelse ".";
    const meta_path = try std.fmt.allocPrint(arena_alloc, "{s}/meta.json", .{manifest_dir});
    var has_learn: bool = false;
    if (std.Io.Dir.cwd().readFileAlloc(io, meta_path, arena_alloc, .unlimited)) |meta_content| {
        if (std.json.parseFromSliceLeaky(std.json.Value, arena_alloc, meta_content, .{})) |meta_parsed| {
            switch (meta_parsed) {
                .object => |mo| {
                    if (mo.get("has_learn")) |hl| switch (hl) {
                        .bool => |b| { has_learn = b; },
                        else => {},
                    };
                },
                else => {},
            }
        } else |_| {}
    } else |_| {
        has_learn = manifest_obj.get("learn") != null;
    }

    // 5. Resolve learn markdown
    var learn_markdown: ?[]const u8 = null;

    if (manifest_obj.get("learn")) |learn_val| switch (learn_val) {
        .string => |s| { learn_markdown = try arena_alloc.dupe(u8, s); },
        .object => |learn_obj| {
            if (learn_obj.get("text")) |t| switch (t) {
                .string => |s| { learn_markdown = try arena_alloc.dupe(u8, s); },
                else => {},
            };
            if (learn_markdown == null) {
                if (learn_obj.get("file")) |f| switch (f) {
                    .string => |fname| {
                        const file_path = try std.fmt.allocPrint(arena_alloc, "{s}/{s}", .{ manifest_dir, fname });
                        learn_markdown = std.Io.Dir.cwd().readFileAlloc(io, file_path, arena_alloc, .unlimited) catch null;
                    },
                    else => {},
                };
            }
        },
        else => {},
    };

    if (learn_markdown == null and has_learn) {
        const skill_path = try std.fmt.allocPrint(arena_alloc, "{s}/skills/quickstart/SKILL.md", .{manifest_dir});
        learn_markdown = std.Io.Dir.cwd().readFileAlloc(io, skill_path, arena_alloc, .unlimited) catch null;
    }

    if (learn_markdown == null) {
        output.exitWithError(gpa, mode, .{
            .code = 92,
            .err_type = "resource_not_found",
            .message = "Plugin does not define learn content",
            .recoverable = false,
            .suggestions = &.{
                "Run: sc-zig plugins show <name>",
                "Run: sc-zig plugins explore --name <name>",
            },
        });
    }

    // 6. Output
    if (mode == .human) {
        output.writeRaw(learn_markdown.?);
        if (learn_markdown.?[learn_markdown.?.len - 1] != '\n') output.writeRaw("\n");
        return;
    }

    var out: std.Io.Writer.Allocating = .init(gpa);
    defer out.deinit();
    var jw: std.json.Stringify = .{ .writer = &out.writer };
    jw.beginObject() catch return;
    jw.objectField("name") catch return;
    jw.write(plugin_name) catch return;
    jw.objectField("plugin") catch return;
    jw.write(plugin_name) catch return;
    jw.objectField("installed") catch return;
    jw.write(is_installed) catch return;
    jw.objectField("learn_markdown") catch return;
    jw.write(learn_markdown.?) catch return;
    jw.endObject() catch return;
    output.writeRaw(out.written());
    output.writeRaw("\n");
}
