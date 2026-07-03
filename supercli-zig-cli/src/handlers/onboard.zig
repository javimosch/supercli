// onboard.zig — `sc onboard` / `sc offboard` — harness detection and skill file installation
// Mirrors cli/harness-onboard.js.
const std = @import("std");
const output = @import("../output.zig");

const HarnessConfig = struct {
    name: []const u8,
    skill_path: []const u8,
    detect_patterns: []const []const u8,
};

const HARNESS_CONFIGS = [_]HarnessConfig{
    .{ .name = "claude", .skill_path = ".claude/skills/supercli/SKILL.md", .detect_patterns = &.{".claude"} },
    .{ .name = "opencode", .skill_path = ".opencode/skills/supercli/SKILL.md", .detect_patterns = &.{".opencode"} },
    .{ .name = "agents", .skill_path = ".agents/skills/supercli/SKILL.md", .detect_patterns = &.{".agents"} },
    .{ .name = "cursor", .skill_path = ".cursor/rules/supercli.mdc", .detect_patterns = &.{".cursor"} },
    .{ .name = "windsurf", .skill_path = ".windsurfrules", .detect_patterns = &.{".windsurfrules", ".windsurf"} },
};

const ONBOARD_SKILL_MARKDOWN =
    \\---
    \\skill_name: "supercli"
    \\description: "SuperCLI agent skill — discover and execute CLI tools via plugins"
    \\---
    \\# SuperCLI
    \\
    \\SuperCLI is a plugin-based CLI tool manager. Use it to discover, install, and execute CLI tools.
    \\
    \\## Discovery
    \\
    \\```bash
    \\sc plugins explore --name <query> --json
    \\sc discover --intent "I need to convert images" --json
    \\sc commands --json
    \\```
    \\
    \\## Execution
    \\
    \\```bash
    \\sc <namespace> <resource> <action> --json
    \\sc run <plugin> <resource> <action> --json
    \\```
    \\
    \\## Skills
    \\
    \\```bash
    \\sc skills list --catalog --json
    \\sc skills get <provider:skill_id>
    \\sc skills teach
    \\```
;

pub fn handleOnboard(
    io: std.Io,
    gpa: std.mem.Allocator,
    mode: output.Mode,
    flags: std.StringHashMap([]const u8),
) !void {
    const target_dir = flags.get("target") orelse ".";
    const dry_run = flags.contains("dry-run");
    const force = flags.contains("force");

    // --detect mode
    if (flags.contains("detect")) {
        const detected = try detectHarnesses(io, gpa, target_dir);
        if (mode == .human) {
            output.writeLine("\n  Harness Detection\n");
            for (detected) |h| {
                var buf: [128]u8 = undefined;
                const line = std.fmt.bufPrint(&buf, "  {s}\n", .{h}) catch continue;
                output.writeRaw(line);
            }
            output.writeLine("");
            return;
        }
        var out: std.Io.Writer.Allocating = .init(gpa);
        defer out.deinit();
        var jw: std.json.Stringify = .{ .writer = &out.writer };
        jw.beginObject() catch return;
        jw.objectField("mode") catch return;
        jw.write("onboard_detect") catch return;
        jw.objectField("target") catch return;
        jw.write(target_dir) catch return;
        jw.objectField("detected") catch return;
        jw.beginArray() catch return;
        for (detected) |h| jw.write(h) catch return;
        jw.endArray() catch return;
        jw.endObject() catch return;
        output.writeRaw(out.written());
        output.writeRaw("\n");
        return;
    }

    // Determine which harnesses to install
    var harnesses_to_install: std.ArrayList([]const u8) = .empty;
    if (flags.get("harness")) |h_flag| {
        var it = std.mem.splitScalar(u8, h_flag, ',');
        while (it.next()) |h| {
            const trimmed = std.mem.trim(u8, h, " ");
            if (trimmed.len > 0) try harnesses_to_install.append(gpa, trimmed);
        }
    } else {
        const detected = try detectHarnesses(io, gpa, target_dir);
        for (detected) |h| try harnesses_to_install.append(gpa, h);
    }

    if (harnesses_to_install.items.len == 0) {
        output.exitWithError(gpa, mode, .{
            .code = 92,
            .err_type = "resource_not_found",
            .message = "No AI harnesses detected. Use --harness to specify explicitly.",
            .recoverable = false,
            .suggestions = &.{"sc onboard --harness claude,opencode,agents,cursor,windsurf"},
        });
    }

    var results: std.ArrayList(struct {
        harness: []const u8,
        path: []const u8,
        action: []const u8,
        reason: []const u8 = "",
    }) = .empty;

    for (harnesses_to_install.items) |h_name| {
        const hc = findHarnessConfig(h_name) orelse {
            try results.append(gpa, .{ .harness = h_name, .path = "", .action = "skip", .reason = "unknown harness" });
            continue;
        };

        const full_path = try std.fmt.allocPrint(gpa, "{s}/{s}", .{ target_dir, hc.skill_path });

        // Check if file exists
        const exists = blk: {
                _ = std.Io.Dir.cwd().openFile(io, full_path, .{}) catch break :blk false;
                break :blk true;
            };

            if (exists and !force) {
            try results.append(gpa, .{ .harness = h_name, .path = hc.skill_path, .action = "skip", .reason = "exists (use --force to overwrite)" });
        } else {
            if (!dry_run) {
                // Create directories and write file
                writeSkillFile(io, full_path, ONBOARD_SKILL_MARKDOWN) catch {
                    try results.append(gpa, .{ .harness = h_name, .path = hc.skill_path, .action = "error", .reason = "write failed" });
                    continue;
                };
                try results.append(gpa, .{ .harness = h_name, .path = hc.skill_path, .action = "installed" });
            } else {
                try results.append(gpa, .{ .harness = h_name, .path = hc.skill_path, .action = "would_install" });
            }
        }
    }

    if (mode == .human) {
        output.writeLine("\n  SuperCLI Onboard\n");
        for (results.items) |r| {
            const symbol = if (std.mem.eql(u8, r.action, "installed")) "✓" else if (std.mem.eql(u8, r.action, "skip")) "-" else "✗";
            var buf: [256]u8 = undefined;
            const line = std.fmt.bufPrint(&buf, "  {s} {s}: {s}", .{ symbol, r.harness, r.path }) catch continue;
            output.writeRaw(line);
            if (r.reason.len > 0) {
                var rbuf: [128]u8 = undefined;
                const reason_line = std.fmt.bufPrint(&rbuf, " ({s})", .{r.reason}) catch "";
                output.writeRaw(reason_line);
            }
            output.writeRaw("\n");
        }
        if (dry_run) output.writeLine("\n  (dry-run mode - no files written)\n");
        return;
    }

    var out: std.Io.Writer.Allocating = .init(gpa);
    defer out.deinit();
    var jw: std.json.Stringify = .{ .writer = &out.writer };
    jw.beginObject() catch return;
    jw.objectField("mode") catch return;
    jw.write("onboard") catch return;
    jw.objectField("target") catch return;
    jw.write(target_dir) catch return;
    jw.objectField("dry_run") catch return;
    jw.write(dry_run) catch return;
    jw.objectField("results") catch return;
    jw.beginArray() catch return;
    for (results.items) |r| {
        jw.beginObject() catch return;
        jw.objectField("harness") catch return;
        jw.write(r.harness) catch return;
        jw.objectField("path") catch return;
        jw.write(r.path) catch return;
        jw.objectField("action") catch return;
        jw.write(r.action) catch return;
        if (r.reason.len > 0) {
            jw.objectField("reason") catch return;
            jw.write(r.reason) catch return;
        }
        jw.endObject() catch return;
    }
    jw.endArray() catch return;
    jw.endObject() catch return;
    output.writeRaw(out.written());
    output.writeRaw("\n");
}

pub fn handleOffboard(
    io: std.Io,
    gpa: std.mem.Allocator,
    mode: output.Mode,
    flags: std.StringHashMap([]const u8),
) !void {
    const target_dir = flags.get("target") orelse ".";
    const dry_run = flags.contains("dry-run");

    var harnesses_to_remove: std.ArrayList([]const u8) = .empty;
    if (flags.get("harness")) |h_flag| {
        var it = std.mem.splitScalar(u8, h_flag, ',');
        while (it.next()) |h| {
            const trimmed = std.mem.trim(u8, h, " ");
            if (trimmed.len > 0) try harnesses_to_remove.append(gpa, trimmed);
        }
    } else {
        for (HARNESS_CONFIGS) |hc| try harnesses_to_remove.append(gpa, hc.name);
    }

    var results: std.ArrayList(struct {
        harness: []const u8,
        path: []const u8,
        action: []const u8,
        reason: []const u8 = "",
    }) = .empty;

    for (harnesses_to_remove.items) |h_name| {
        const hc = findHarnessConfig(h_name) orelse continue;
        const full_path = try std.fmt.allocPrint(gpa, "{s}/{s}", .{ target_dir, hc.skill_path });

        const exists = blk: {
            _ = std.Io.Dir.cwd().openFile(io, full_path, .{}) catch break :blk false;
            break :blk true;
        };

        if (!exists) {
            try results.append(gpa, .{ .harness = h_name, .path = hc.skill_path, .action = "skip", .reason = "not_found" });
        } else {
            if (!dry_run) {
                std.Io.Dir.cwd().deleteFile(io, full_path) catch {
                    try results.append(gpa, .{ .harness = h_name, .path = hc.skill_path, .action = "error", .reason = "delete failed" });
                    continue;
                };
                try results.append(gpa, .{ .harness = h_name, .path = hc.skill_path, .action = "removed" });
            } else {
                try results.append(gpa, .{ .harness = h_name, .path = hc.skill_path, .action = "would_remove" });
            }
        }
    }

    if (mode == .human) {
        output.writeLine("\n  SuperCLI Offboard\n");
        for (results.items) |r| {
            const symbol = if (std.mem.eql(u8, r.action, "removed")) "✓" else if (std.mem.eql(u8, r.action, "skip")) "-" else "✗";
            var buf: [256]u8 = undefined;
            const line = std.fmt.bufPrint(&buf, "  {s} {s}: {s}\n", .{ symbol, r.harness, r.path }) catch continue;
            output.writeRaw(line);
        }
        if (dry_run) output.writeLine("\n  (dry-run mode - no files removed)\n");
        return;
    }

    var out: std.Io.Writer.Allocating = .init(gpa);
    defer out.deinit();
    var jw: std.json.Stringify = .{ .writer = &out.writer };
    jw.beginObject() catch return;
    jw.objectField("mode") catch return;
    jw.write("offboard") catch return;
    jw.objectField("target") catch return;
    jw.write(target_dir) catch return;
    jw.objectField("dry_run") catch return;
    jw.write(dry_run) catch return;
    jw.objectField("results") catch return;
    jw.beginArray() catch return;
    for (results.items) |r| {
        jw.beginObject() catch return;
        jw.objectField("harness") catch return;
        jw.write(r.harness) catch return;
        jw.objectField("path") catch return;
        jw.write(r.path) catch return;
        jw.objectField("action") catch return;
        jw.write(r.action) catch return;
        if (r.reason.len > 0) {
            jw.objectField("reason") catch return;
            jw.write(r.reason) catch return;
        }
        jw.endObject() catch return;
    }
    jw.endArray() catch return;
    jw.endObject() catch return;
    output.writeRaw(out.written());
    output.writeRaw("\n");
}

fn findHarnessConfig(name: []const u8) ?HarnessConfig {
    for (HARNESS_CONFIGS) |hc| {
        if (std.mem.eql(u8, hc.name, name)) return hc;
    }
    return null;
}

fn detectHarnesses(io: std.Io, gpa: std.mem.Allocator, target_dir: []const u8) ![][]const u8 {
    var detected: std.ArrayList([]const u8) = .empty;
    for (HARNESS_CONFIGS) |hc| {
        for (hc.detect_patterns) |pattern| {
            const full_path = try std.fmt.allocPrint(gpa, "{s}/{s}", .{ target_dir, pattern });
            const exists = blk: {
                _ = std.Io.Dir.cwd().openDir(io, full_path, .{}) catch break :blk false;
                break :blk true;
            };
            if (exists) {
                try detected.append(gpa, hc.name);
                break;
            }
        }
    }
    return detected.toOwnedSlice(gpa);
}

fn writeSkillFile(io: std.Io, full_path: []const u8, content: []const u8) !void {
    // Create parent directories recursively
    const last_slash = std.mem.lastIndexOfScalar(u8, full_path, '/') orelse return;
    const dir_path = full_path[0..last_slash];

    std.Io.Dir.cwd().createDirPath(io, dir_path) catch |err| switch (err) {
        error.PathAlreadyExists => {},
        else => return err,
    };

    try std.Io.Dir.cwd().writeFile(io, .{ .sub_path = full_path, .data = content });
}
