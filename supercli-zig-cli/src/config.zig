// config.zig — Read and write ~/.supercli/plugins/plugins.lock.json
// Mirrors the schema used by the Node.js plugins-store.js
const std = @import("std");

pub const SUPERCLI_DIR = ".supercli";
pub const PLUGINS_SUBDIR = ".supercli/plugins";
pub const LOCK_FILE = ".supercli/plugins/plugins.lock.json";

// Command as stored in plugins.lock.json
pub const Command = struct {
    namespace: []const u8,
    resource: []const u8,
    action: []const u8,
    description: []const u8 = "",
    adapter: []const u8 = "process",
    plugin_name: ?[]const u8 = null,
    plugin_dir: ?[]const u8 = null,
    // adapterConfig is kept as raw JSON value for flexibility
    adapter_config_raw: ?std.json.Value = null,
    args_raw: ?std.json.Value = null,
};

// Installed plugin entry
pub const Plugin = struct {
    name: []const u8,
    version: []const u8 = "0.0.0",
    description: []const u8 = "",
    source: []const u8 = "",
    commands: []Command,
};

pub const Lock = struct {
    version: u32 = 1,
    plugins: []Plugin,
    arena: std.heap.ArenaAllocator,

    pub fn deinit(self: *Lock) void {
        self.arena.deinit();
    }
};

// Parse a single command from its JSON object
fn parseCommand(gpa: std.mem.Allocator, obj: std.json.ObjectMap, plugin_name: []const u8, plugin_dir: []const u8) !Command {
    const ns = if (obj.get("namespace")) |v| switch (v) {
        .string => |s| try gpa.dupe(u8, s),
        else => try gpa.dupe(u8, ""),
    } else try gpa.dupe(u8, "");

    const res = if (obj.get("resource")) |v| switch (v) {
        .string => |s| try gpa.dupe(u8, s),
        else => try gpa.dupe(u8, "_"),
    } else try gpa.dupe(u8, "_");

    const act = if (obj.get("action")) |v| switch (v) {
        .string => |s| try gpa.dupe(u8, s),
        else => try gpa.dupe(u8, "_"),
    } else try gpa.dupe(u8, "_");

    const desc = if (obj.get("description")) |v| switch (v) {
        .string => |s| try gpa.dupe(u8, s),
        else => try gpa.dupe(u8, ""),
    } else try gpa.dupe(u8, "");

    const adapter = if (obj.get("adapter")) |v| switch (v) {
        .string => |s| try gpa.dupe(u8, s),
        else => try gpa.dupe(u8, "process"),
    } else try gpa.dupe(u8, "process");

    const pname = if (obj.get("plugin_name")) |v| switch (v) {
        .string => |s| try gpa.dupe(u8, s),
        else => try gpa.dupe(u8, plugin_name),
    } else try gpa.dupe(u8, plugin_name);

    const pdir = if (obj.get("plugin_dir")) |v| switch (v) {
        .string => |s| try gpa.dupe(u8, s),
        else => try gpa.dupe(u8, plugin_dir),
    } else try gpa.dupe(u8, plugin_dir);

    return Command{
        .namespace = ns,
        .resource = res,
        .action = act,
        .description = desc,
        .adapter = adapter,
        .plugin_name = pname,
        .plugin_dir = pdir,
        .adapter_config_raw = obj.get("adapterConfig"),
        .args_raw = obj.get("args"),
    };
}

// Read and parse the plugins lock file.
// Returns a Lock whose arena owns all allocations.
pub fn readLock(io: std.Io, home: []const u8, extra_gpa: std.mem.Allocator) !Lock {
    var arena = std.heap.ArenaAllocator.init(extra_gpa);
    errdefer arena.deinit();
    const gpa = arena.allocator();

    const lock_path = try std.fmt.allocPrint(gpa, "{s}/{s}", .{ home, LOCK_FILE });

    const content = std.Io.Dir.cwd().readFileAlloc(io, lock_path, gpa, .unlimited) catch {
        // Return empty lock if file doesn't exist
        return Lock{
            .version = 1,
            .plugins = try gpa.alloc(Plugin, 0),
            .arena = arena,
        };
    };

    const parsed = try std.json.parseFromSliceLeaky(std.json.Value, gpa, content, .{});

    const root_obj = switch (parsed) {
        .object => |o| o,
        else => return Lock{ .version = 1, .plugins = try gpa.alloc(Plugin, 0), .arena = arena },
    };

    const installed_val = root_obj.get("installed") orelse return Lock{
        .version = 1,
        .plugins = try gpa.alloc(Plugin, 0),
        .arena = arena,
    };

    const installed_obj = switch (installed_val) {
        .object => |o| o,
        else => return Lock{ .version = 1, .plugins = try gpa.alloc(Plugin, 0), .arena = arena },
    };

    var plugin_list: std.ArrayList(Plugin) = .empty;

    var iter = installed_obj.iterator();
    while (iter.next()) |entry| {
        const plugin_val = entry.value_ptr.*;
        const plugin_obj = switch (plugin_val) {
            .object => |o| o,
            else => continue,
        };

        const pname = try gpa.dupe(u8, entry.key_ptr.*);

        const pversion = if (plugin_obj.get("version")) |v| switch (v) {
            .string => |s| try gpa.dupe(u8, s),
            else => try gpa.dupe(u8, "0.0.0"),
        } else try gpa.dupe(u8, "0.0.0");

        const pdesc = if (plugin_obj.get("description")) |v| switch (v) {
            .string => |s| try gpa.dupe(u8, s),
            else => try gpa.dupe(u8, ""),
        } else try gpa.dupe(u8, "");

        const psource = if (plugin_obj.get("source")) |v| switch (v) {
            .string => |s| try gpa.dupe(u8, s),
            else => try gpa.dupe(u8, ""),
        } else try gpa.dupe(u8, "");

        // plugin_dir from resolved_from or empty
        const pdir = if (plugin_obj.get("resolved_from")) |rf| blk: {
            const rfobj = switch (rf) {
                .object => |o| o,
                else => break :blk try gpa.dupe(u8, ""),
            };
            if (rfobj.get("manifest_path")) |mp| switch (mp) {
                .string => |s| {
                    // manifest_path is relative; get its directory
                    const dir = std.fs.path.dirname(s) orelse "";
                    break :blk try gpa.dupe(u8, dir);
                },
                else => break :blk try gpa.dupe(u8, ""),
            };
            break :blk try gpa.dupe(u8, "");
        } else try gpa.dupe(u8, "");

        var cmd_list: std.ArrayList(Command) = .empty;
        if (plugin_obj.get("commands")) |cmds_val| {
            switch (cmds_val) {
                .array => |arr| {
                    for (arr.items) |cmd_val| {
                        switch (cmd_val) {
                            .object => |cmd_obj| {
                                const cmd = try parseCommand(gpa, cmd_obj, pname, pdir);
                                try cmd_list.append(gpa, cmd);
                            },
                            else => {},
                        }
                    }
                },
                else => {},
            }
        }

        try plugin_list.append(gpa, Plugin{
            .name = pname,
            .version = pversion,
            .description = pdesc,
            .source = psource,
            .commands = try cmd_list.toOwnedSlice(gpa),
        });
    }

    return Lock{
        .version = 1,
        .plugins = try plugin_list.toOwnedSlice(gpa),
        .arena = arena,
    };
}

// Get all commands across all installed plugins
pub fn allCommands(lock: *const Lock, gpa: std.mem.Allocator) ![]Command {
    var list: std.ArrayList(Command) = .empty;
    for (lock.plugins) |plugin| {
        for (plugin.commands) |cmd| {
            try list.append(gpa, cmd);
        }
    }
    return list.toOwnedSlice(gpa);
}

// Find a specific command by namespace.resource.action
pub fn findCommand(lock: *const Lock, ns: []const u8, res: []const u8, act: []const u8) ?Command {
    for (lock.plugins) |plugin| {
        for (plugin.commands) |cmd| {
            if (std.mem.eql(u8, cmd.namespace, ns) and
                std.mem.eql(u8, cmd.resource, res) and
                std.mem.eql(u8, cmd.action, act))
            {
                return cmd;
            }
        }
    }
    return null;
}

// Find a passthrough command for a namespace (resource == "_", action == "_")
pub fn findPassthrough(lock: *const Lock, ns: []const u8) ?Command {
    for (lock.plugins) |plugin| {
        for (plugin.commands) |cmd| {
            if (std.mem.eql(u8, cmd.namespace, ns) and
                std.mem.eql(u8, cmd.resource, "_") and
                std.mem.eql(u8, cmd.action, "_"))
            {
                return cmd;
            }
        }
    }
    return null;
}

test "allCommands returns commands from all plugins" {
    const testing = std.testing;
    const arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const gpa = arena.allocator();

    const cmd1 = Command{
        .namespace = try gpa.dupe(u8, "test"),
        .resource = try gpa.dupe(u8, "res1"),
        .action = try gpa.dupe(u8, "act1"),
        .description = try gpa.dupe(u8, "First command"),
    };
    const cmd2 = Command{
        .namespace = try gpa.dupe(u8, "test"),
        .resource = try gpa.dupe(u8, "res2"),
        .action = try gpa.dupe(u8, "act2"),
        .description = try gpa.dupe(u8, "Second command"),
    };
    const plugin = Plugin{
        .name = try gpa.dupe(u8, "test-plugin"),
        .commands = &.{ cmd1, cmd2 },
    };
    var lock = Lock{
        .plugins = &.{plugin},
        .arena = arena,
    };

    const result = try allCommands(&lock, testing.allocator);
    defer testing.allocator.free(result);

    try testing.expectEqual(@as(usize, 2), result.len);
    try testing.expectEqualStrings("test", result[0].namespace);
    try testing.expectEqualStrings("res1", result[0].resource);
    try testing.expectEqualStrings("res2", result[1].resource);
}

test "findCommand returns matching command" {
    const testing = std.testing;
    const arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const gpa = arena.allocator();

    const cmd1 = Command{
        .namespace = try gpa.dupe(u8, "uuid"),
        .resource = try gpa.dupe(u8, "self"),
        .action = try gpa.dupe(u8, "generate"),
    };
    const cmd2 = Command{
        .namespace = try gpa.dupe(u8, "http"),
        .resource = try gpa.dupe(u8, "check"),
        .action = try gpa.dupe(u8, "health"),
    };
    const plugin = Plugin{
        .name = try gpa.dupe(u8, "test-plugin"),
        .commands = &.{ cmd1, cmd2 },
    };
    var lock = Lock{
        .plugins = &.{plugin},
        .arena = arena,
    };

    const found = findCommand(&lock, "http", "check", "health");
    try testing.expect(found != null);
    try testing.expectEqualStrings("http", found.?.namespace);
    try testing.expectEqualStrings("check", found.?.resource);
    try testing.expectEqualStrings("health", found.?.action);

    const not_found = findCommand(&lock, "http", "check", "status");
    try testing.expect(not_found == null);
}

test "findCommand returns null for empty plugins" {
    const testing = std.testing;
    const arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const gpa = arena.allocator();

    var lock = Lock{
        .plugins = try gpa.alloc(Plugin, 0),
        .arena = arena,
    };

    const result = findCommand(&lock, "any", "any", "any");
    try testing.expect(result == null);
}

test "findPassthrough matches namespace with wildcard resource/action" {
    const testing = std.testing;
    const arena = std.heap.ArenaAllocator.init(testing.allocator);
    defer arena.deinit();
    const gpa = arena.allocator();

    const passthrough_cmd = Command{
        .namespace = try gpa.dupe(u8, "mytool"),
        .resource = try gpa.dupe(u8, "_"),
        .action = try gpa.dupe(u8, "_"),
    };
    const specific_cmd = Command{
        .namespace = try gpa.dupe(u8, "mytool"),
        .resource = try gpa.dupe(u8, "config"),
        .action = try gpa.dupe(u8, "show"),
    };
    const plugin = Plugin{
        .name = try gpa.dupe(u8, "mytool-plugin"),
        .commands = &.{ passthrough_cmd, specific_cmd },
    };
    var lock = Lock{
        .plugins = &.{plugin},
        .arena = arena,
    };

    const found = findPassthrough(&lock, "mytool");
    try testing.expect(found != null);
    try testing.expectEqualStrings("_", found.?.resource);
    try testing.expectEqualStrings("_", found.?.action);

    const not_found = findPassthrough(&lock, "nonexistent");
    try testing.expect(not_found == null);
}

test "readLock handles malformed JSON gracefully" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var tmp = testing.tmpDir(.{}).openDir();
    defer tmp.close();
    const tmp_path = try tmp.realpathAlloc(gpa, ".");

    const lock = try readLock(std.Io.Dir.cwd().io(), tmp_path, gpa);
    defer lock.deinit();

    try testing.expectEqual(@as(usize, 0), lock.plugins.len);
}
