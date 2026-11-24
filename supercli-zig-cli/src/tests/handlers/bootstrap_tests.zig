const std = @import("std");
const th = @import("../../test_helpers.zig");
const mod = @import("../../handlers/bootstrap.zig");

const VERSION = mod.VERSION;
const handleBootstrap = mod.handleBootstrap;
const handleVersionInfo = mod.handleVersionInfo;
const handleInstallAsSc = mod.handleInstallAsSc;

test "bootstrap JSON output has expected fields" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var cap = th.OutputCapture{ .alloc = gpa };
    cap.install();
    defer cap.release();

    handleBootstrap(gpa, .json);

    const parsed = try th.parseJson(gpa, cap.stdout());
    defer parsed.deinit();

    const root = parsed.value.object;
    try testing.expectEqualStrings("1.0", root.get("version").?.string);
    try testing.expectEqualStrings("agent_bootstrap", root.get("mode").?.string);
    try testing.expectEqualStrings("supercli-zig", root.get("name").?.string);
    try testing.expectEqualStrings(VERSION, root.get("zig_version").?.string);
    try testing.expect(root.get("what_is_this") != null);
    try testing.expect(root.get("workflow") != null);

    const first_steps = root.get("first_steps").?.array;
    try testing.expectEqual(@as(usize, 5), first_steps.items.len);

    const memory_workflow = root.get("memory_workflow").?.object;
    try testing.expectEqual(@as(usize, 4), memory_workflow.count());
    try testing.expectEqualStrings("sc-zig plugins explore --name memory", memory_workflow.get("step1").?.string);
}

test "bootstrap human output contains usage header" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var cap = th.OutputCapture{ .alloc = gpa };
    cap.install();
    defer cap.release();

    handleBootstrap(gpa, .human);

    try testing.expect(std.mem.indexOf(u8, cap.stdout(), "SuperCLI (Zig)") != null);
    try testing.expect(std.mem.indexOf(u8, cap.stdout(), "Usage:") != null);
    try testing.expect(std.mem.indexOf(u8, cap.stdout(), "Quick start:") != null);
}

test "version info JSON has expected fields" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var cap = th.OutputCapture{ .alloc = gpa };
    cap.install();
    defer cap.release();

    handleVersionInfo(gpa, .json);

    const parsed = try th.parseJson(gpa, cap.stdout());
    defer parsed.deinit();

    const root = parsed.value.object;
    try testing.expectEqualStrings("SuperCLI", root.get("name").?.string);
    try testing.expectEqualStrings("Zig", root.get("implementation").?.string);
    try testing.expectEqualStrings(VERSION, root.get("version").?.string);
    try testing.expectEqualStrings("0.16.0", root.get("zig_version").?.string);
    try testing.expectEqualStrings("sc-zig", root.get("binary_name").?.string);
}

test "version info human output contains version line" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var cap = th.OutputCapture{ .alloc = gpa };
    cap.install();
    defer cap.release();

    handleVersionInfo(gpa, .human);

    try testing.expect(std.mem.indexOf(u8, cap.stdout(), "SuperCLI (Zig) v0.1.0") != null);
    try testing.expect(std.mem.indexOf(u8, cap.stdout(), "Implementation: Zig") != null);
}

test "VERSION constant is valid semver-like string" {
    const testing = std.testing;
    try testing.expect(VERSION.len > 0);
    try testing.expect(std.mem.indexOf(u8, VERSION, ".") != null);
}
