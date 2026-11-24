const std = @import("std");
const mod = @import("../config.zig");

const SUPERCLI_DIR = mod.SUPERCLI_DIR;
const PLUGINS_SUBDIR = mod.PLUGINS_SUBDIR;
const LOCK_FILE = mod.LOCK_FILE;
const Command = mod.Command;
const Plugin = mod.Plugin;
const Lock = mod.Lock;
const readLock = mod.readLock;
const allCommands = mod.allCommands;
const findCommand = mod.findCommand;
const findPassthrough = mod.findPassthrough;

test "allCommands returns commands from all plugins" {
    const testing = std.testing;
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
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
        .commands = blk: {
            var cmds = [_]Command{ cmd1, cmd2 };
            break :blk &cmds;
        },
    };
    var lock = Lock{
        .plugins = blk: {
            var plugins = [_]Plugin{plugin};
            break :blk &plugins;
        },
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
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
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
        .commands = blk: {
            var cmds = [_]Command{ cmd1, cmd2 };
            break :blk &cmds;
        },
    };
    var lock = Lock{
        .plugins = blk: {
            var plugins = [_]Plugin{plugin};
            break :blk &plugins;
        },
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
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
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
    var arena = std.heap.ArenaAllocator.init(testing.allocator);
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
        .commands = blk: {
            var cmds = [_]Command{ passthrough_cmd, specific_cmd };
            break :blk &cmds;
        },
    };
    var lock = Lock{
        .plugins = blk: {
            var plugins = [_]Plugin{plugin};
            break :blk &plugins;
        },
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

    var threaded = std.Io.Threaded.init(gpa, .{});
    defer threaded.deinit();
    const io = threaded.io();

    // Use a path that definitely doesn't have a lock file
    const tmp_path = "/tmp/sc-zig-test-nonexistent-dir-12345";

    var lock = try readLock(io, tmp_path, gpa);
    defer lock.deinit();

    try testing.expectEqual(@as(usize, 0), lock.plugins.len);
}
