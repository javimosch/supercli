// skills.zig — skills subcommands: sync, list, search, get, teach, providers
// Mirrors cli/skills.js handler logic.
const std = @import("std");
const output = @import("../output.zig");
const config = @import("../config.zig");
const catalog = @import("../skills_catalog.zig");

const TEACH_MARKDOWN =
    \\---
    \\skill_name: "teach_skills_usage"
    \\description: "Introduces LLMs to SuperCLI capability and skill-document commands"
    \\command: "skills teach"
    \\---
    \\# Instruction
    \\
    \\This skill teaches LLMs how to discover and use SuperCLI capabilities and skill documents:
    \\1. List available capability docs and catalog skills:
    \\```bash
    \\sc-zig skills list --json
    \\```
    \\2. Fetch documentation for a specific capability:
    \\```bash
    \\sc-zig skills get <namespace.resource.action> --format skill.md
    \\```
    \\3. Parse YAML frontmatter to understand command, arguments, output schema, and metadata.
    \\4. Execute the capability with validated arguments:
    \\```bash
    \\sc-zig <namespace> <resource> <action> --arg value --json
    \\```
    \\5. Search skill documents:
    \\```bash
    \\sc-zig skills search --query <text> --json
    \\```
    \\6. Sync skills catalog from providers:
    \\```bash
    \\sc-zig skills sync
    \\```
    \\# Examples
    \\
    \\```bash
    \\sc-zig skills teach
    \\sc-zig skills list --catalog --json
    \\sc-zig skills search --query memory --json
    \\sc-zig skills get supercli:diagnose
    \\```
;

pub fn handleSkills(
    io: std.Io,
    gpa: std.mem.Allocator,
    mode: output.Mode,
    pos: [][]const u8,
    flags: std.StringHashMap([]const u8),
    home: []const u8,
) !void {
    const sub = if (pos.len > 1) pos[1] else "";

    if (sub.len == 0) {
        handleSkillsHelp(gpa, mode);
        return;
    }

    if (std.mem.eql(u8, sub, "sync")) {
        try handleSkillsSync(io, gpa, mode, home);
        return;
    }

    if (std.mem.eql(u8, sub, "list")) {
        try handleSkillsList(io, gpa, mode, flags, home);
        return;
    }

    if (std.mem.eql(u8, sub, "search")) {
        try handleSkillsSearch(io, gpa, mode, flags, home);
        return;
    }

    if (std.mem.eql(u8, sub, "get")) {
        try handleSkillsGet(io, gpa, mode, pos, home);
        return;
    }

    if (std.mem.eql(u8, sub, "teach")) {
        output.writeRaw(TEACH_MARKDOWN);
        output.writeRaw("\n");
        return;
    }

    if (std.mem.eql(u8, sub, "providers")) {
        try handleSkillsProviders(io, gpa, mode, pos, home);
        return;
    }

    output.exitWithError(gpa, mode, .{
        .code = 85,
        .err_type = "invalid_argument",
        .message = "Unknown skills subcommand. Use: list, get, teach, sync, search, providers",
        .recoverable = false,
    });
}

fn handleSkillsHelp(gpa: std.mem.Allocator, mode: output.Mode) void {
    if (mode == .human) {
        output.writeLine("");
        output.writeLine("  SuperCLI Skills");
        output.writeLine("  Skill documents provide agent-facing guidance in SKILL.md format.");
        output.writeLine("");
        output.writeLine("  Subcommands:");
        output.writeLine("    list           List available skills (--catalog, --limit, --offset)");
        output.writeLine("    get <id>       Get skill documentation");
        output.writeLine("    teach          Get the skills usage guide");
        output.writeLine("    sync           Sync skills catalog");
        output.writeLine("    search         Search skills (--query, --limit, --offset)");
        output.writeLine("    providers      Manage skill providers");
        output.writeLine("");
        return;
    }

    var out: std.Io.Writer.Allocating = .init(gpa);
    defer out.deinit();
    var jw: std.json.Stringify = .{ .writer = &out.writer };
    jw.beginObject() catch return;
    jw.objectField("version") catch return;
    jw.write("1.0") catch return;
    jw.objectField("mode") catch return;
    jw.write("skills_help") catch return;
    jw.objectField("description") catch return;
    jw.write("Skill documents provide agent-facing guidance in SKILL.md format") catch return;
    jw.objectField("subcommands") catch return;
    jw.beginObject() catch return;
    jw.objectField("list") catch return;
    jw.write("List available skills (--catalog, --limit, --offset)") catch return;
    jw.objectField("get") catch return;
    jw.write("Get skill documentation for a specific capability") catch return;
    jw.objectField("teach") catch return;
    jw.write("Get the skills usage guide") catch return;
    jw.objectField("sync") catch return;
    jw.write("Sync skills catalog from providers") catch return;
    jw.objectField("search") catch return;
    jw.write("Search skills catalog (--query, --limit, --offset)") catch return;
    jw.objectField("providers") catch return;
    jw.write("Manage skill providers (list)") catch return;
    jw.endObject() catch return;
    jw.endObject() catch return;
    output.writeRaw(out.written());
    output.writeRaw("\n");
}

fn handleSkillsSync(io: std.Io, gpa: std.mem.Allocator, mode: output.Mode, home: []const u8) !void {
    const result = try catalog.syncCatalog(gpa, io, home);

    if (mode == .human) {
        var buf: [128]u8 = undefined;
        const msg = std.fmt.bufPrint(&buf, "  Synced {d} skills from {d} providers\n", .{ result.skills.len, result.providers.len }) catch "";
        output.writeRaw(msg);
        return;
    }

    var out: std.Io.Writer.Allocating = .init(gpa);
    defer out.deinit();
    var jw: std.json.Stringify = .{ .writer = &out.writer };
    jw.beginObject() catch return;
    jw.objectField("ok") catch return;
    jw.write(true) catch return;
    jw.objectField("providers") catch return;
    jw.beginArray() catch return;
    for (result.providers) |p| jw.write(p) catch return;
    jw.endArray() catch return;
    jw.objectField("skills") catch return;
    jw.write(result.skills.len) catch return;
    jw.endObject() catch return;
    output.writeRaw(out.written());
    output.writeRaw("\n");
}

fn handleSkillsList(io: std.Io, gpa: std.mem.Allocator, mode: output.Mode, flags: std.StringHashMap([]const u8), home: []const u8) !void {
    const use_catalog = flags.get("catalog") != null;

    if (!use_catalog) {
        // Command-level skills from lockfile
        var lock = try config.readLock(io, home, gpa);
        defer lock.deinit();
        const cmds = try config.allCommands(&lock, gpa);
        defer gpa.free(cmds);

        if (mode == .human) {
            output.writeLine("\n  Skills (command-level only)\n");
            for (cmds) |cmd| {
                var buf: [256]u8 = undefined;
                const line = std.fmt.bufPrint(&buf, "  {s}.{s}.{s}  {s}\n", .{
                    cmd.namespace, cmd.resource, cmd.action, cmd.description,
                }) catch continue;
                output.writeRaw(line);
            }
            output.writeLine("");
            return;
        }

        var out: std.Io.Writer.Allocating = .init(gpa);
        defer out.deinit();
        var jw: std.json.Stringify = .{ .writer = &out.writer };
        jw.beginObject() catch return;
        jw.objectField("skills") catch return;
        jw.beginArray() catch return;
        for (cmds) |cmd| {
            jw.beginObject() catch return;
            jw.objectField("name") catch return;
            const name_str = try std.fmt.allocPrint(gpa, "{s}.{s}.{s}", .{ cmd.namespace, cmd.resource, cmd.action });
            defer gpa.free(name_str);
            jw.write(name_str) catch return;
            jw.objectField("description") catch return;
            jw.write(cmd.description) catch return;
            jw.endObject() catch return;
        }
        jw.endArray() catch return;
        jw.endObject() catch return;
        output.writeRaw(out.written());
        output.writeRaw("\n");
        return;
    }

    // Catalog mode
    const all_skills = try catalog.readIndex(gpa, io, home);
    const limit: usize = blk: {
        const ls = flags.get("limit") orelse "50";
        break :blk std.fmt.parseInt(usize, ls, 10) catch 50;
    };
    const offset: usize = blk: {
        const os = flags.get("offset") orelse "0";
        break :blk std.fmt.parseInt(usize, os, 10) catch 0;
    };

    const total = all_skills.len;
    const start = @min(offset, total);
    const returned = @min(limit, total - start);

    if (mode == .human) {
        output.writeLine("\n  Skills\n");
        for (all_skills[start .. start + returned]) |s| {
            var buf: [256]u8 = undefined;
            const line = std.fmt.bufPrint(&buf, "  {s}  {s}\n", .{ s.id, s.name }) catch continue;
            output.writeRaw(line);
        }
        var buf2: [64]u8 = undefined;
        const summary = std.fmt.bufPrint(&buf2, "  Returned: {d}/{d}  (offset: {d})\n\n", .{ returned, total, start }) catch "";
        output.writeRaw(summary);
        return;
    }

    var out: std.Io.Writer.Allocating = .init(gpa);
    defer out.deinit();
    var jw: std.json.Stringify = .{ .writer = &out.writer };
    jw.beginObject() catch return;
    jw.objectField("skills") catch return;
    jw.beginArray() catch return;
    for (all_skills[start .. start + returned]) |s| {
        jw.beginObject() catch return;
        jw.objectField("id") catch return;
        jw.write(s.id) catch return;
        jw.objectField("name") catch return;
        jw.write(s.name) catch return;
        jw.objectField("description") catch return;
        jw.write(s.description) catch return;
        jw.objectField("provider") catch return;
        jw.write(s.provider) catch return;
        jw.endObject() catch return;
    }
    jw.endArray() catch return;
    jw.objectField("total") catch return;
    jw.write(total) catch return;
    jw.objectField("returned") catch return;
    jw.write(returned) catch return;
    jw.objectField("offset") catch return;
    jw.write(start) catch return;
    jw.endObject() catch return;
    output.writeRaw(out.written());
    output.writeRaw("\n");
}

fn handleSkillsSearch(io: std.Io, gpa: std.mem.Allocator, mode: output.Mode, flags: std.StringHashMap([]const u8), home: []const u8) !void {
    const query = flags.get("query") orelse flags.get("q") orelse "";
    if (query.len == 0) {
        output.exitWithError(gpa, mode, .{
            .code = 85,
            .err_type = "invalid_argument",
            .message = "Usage: sc-zig skills search --query <text>",
            .recoverable = false,
        });
    }

    const results = try catalog.searchCatalog(gpa, io, home, query);
    const limit: usize = blk: {
        const ls = flags.get("limit") orelse "50";
        break :blk std.fmt.parseInt(usize, ls, 10) catch 50;
    };
    const offset: usize = blk: {
        const os = flags.get("offset") orelse "0";
        break :blk std.fmt.parseInt(usize, os, 10) catch 0;
    };

    const total = results.len;
    const start = @min(offset, total);
    const returned = @min(limit, total - start);

    if (mode == .human) {
        output.writeLine("\n  Skills Search\n");
        for (results[start .. start + returned]) |s| {
            var buf: [256]u8 = undefined;
            const line = std.fmt.bufPrint(&buf, "  {s}  {s}\n", .{ s.id, s.name }) catch continue;
            output.writeRaw(line);
        }
        var buf2: [64]u8 = undefined;
        const summary = std.fmt.bufPrint(&buf2, "  Returned: {d}/{d}\n\n", .{ returned, total }) catch "";
        output.writeRaw(summary);
        return;
    }

    var out: std.Io.Writer.Allocating = .init(gpa);
    defer out.deinit();
    var jw: std.json.Stringify = .{ .writer = &out.writer };
    jw.beginObject() catch return;
    jw.objectField("skills") catch return;
    jw.beginArray() catch return;
    for (results[start .. start + returned]) |s| {
        jw.beginObject() catch return;
        jw.objectField("id") catch return;
        jw.write(s.id) catch return;
        jw.objectField("name") catch return;
        jw.write(s.name) catch return;
        jw.objectField("description") catch return;
        jw.write(s.description) catch return;
        jw.objectField("provider") catch return;
        jw.write(s.provider) catch return;
        jw.endObject() catch return;
    }
    jw.endArray() catch return;
    jw.objectField("total") catch return;
    jw.write(total) catch return;
    jw.objectField("returned") catch return;
    jw.write(returned) catch return;
    jw.objectField("offset") catch return;
    jw.write(start) catch return;
    jw.endObject() catch return;
    output.writeRaw(out.written());
    output.writeRaw("\n");
}

fn handleSkillsGet(io: std.Io, gpa: std.mem.Allocator, mode: output.Mode, pos: [][]const u8, home: []const u8) !void {
    const skill_id = if (pos.len > 2) pos[2] else "";
    if (skill_id.len == 0) {
        output.exitWithError(gpa, mode, .{
            .code = 85,
            .err_type = "invalid_argument",
            .message = "Usage: sc-zig skills get <namespace.resource.action> or <provider:skill_id>",
            .recoverable = false,
        });
    }

    // Catalog skill (contains ':')
    if (std.mem.indexOf(u8, skill_id, ":") != null) {
        const result = try catalog.getCatalogSkill(gpa, io, home, skill_id);
        if (result) |r| {
            output.writeRaw(r.markdown);
            if (r.markdown.len > 0 and r.markdown[r.markdown.len - 1] != '\n') {
                output.writeRaw("\n");
            }
            return;
        }
        output.exitWithError(gpa, mode, .{
            .code = 92,
            .err_type = "resource_not_found",
            .message = "Skill not found in catalog",
            .recoverable = false,
            .suggestions = &.{ "Run: sc-zig skills sync", "Run: sc-zig skills list --catalog --json" },
        });
    }

    // Command-level skill (dotted ns.res.act)
    var part_count: usize = 0;
    var ns: []const u8 = "";
    var res: []const u8 = "";
    var act: []const u8 = "";
    var it = std.mem.splitScalar(u8, skill_id, '.');
    while (it.next()) |p| {
        switch (part_count) {
            0 => ns = p,
            1 => res = p,
            2 => act = p,
            else => {},
        }
        part_count += 1;
    }

    if (part_count != 3) {
        output.exitWithError(gpa, mode, .{
            .code = 85,
            .err_type = "invalid_argument",
            .message = "Usage: sc-zig skills get <namespace.resource.action>",
            .recoverable = false,
        });
    }

    var lock = try config.readLock(io, home, gpa);
    defer lock.deinit();
    const cmd = config.findCommand(&lock, ns, res, act) orelse {
        output.exitWithError(gpa, mode, .{
            .code = 92,
            .err_type = "resource_not_found",
            .message = "Skill not found",
            .recoverable = false,
            .suggestions = &.{"Run: sc-zig skills list --json"},
        });
    };

    // Build command skill markdown
    var buf: [4096]u8 = undefined;
    const markdown = std.fmt.bufPrint(&buf,
        \\---
        \\skill_name: "{s}_{s}_{s}"
        \\description: "{s}"
        \\command: "{s} {s} {s}"
        \\---
        \\# Examples
        \\
        \\```bash
        \\sc-zig {s} {s} {s} --json
        \\```
    , .{
        cmd.namespace, cmd.resource, cmd.action,
        cmd.description,
        cmd.namespace, cmd.resource, cmd.action,
        cmd.namespace, cmd.resource, cmd.action,
    }) catch "";

    output.writeRaw(markdown);
    output.writeRaw("\n");
}

fn handleSkillsProviders(io: std.Io, gpa: std.mem.Allocator, mode: output.Mode, pos: [][]const u8, home: []const u8) !void {
    const action = if (pos.len > 2) pos[2] else "";

    if (std.mem.eql(u8, action, "list")) {
        const providers = try catalog.listProviders(gpa, io, home);

        if (mode == .human) {
            output.writeLine("\n  Skill Providers\n");
            for (providers) |p| {
                var buf: [256]u8 = undefined;
                const line = std.fmt.bufPrint(&buf, "  {s}  [{s}]  enabled={s}\n", .{
                    p.name, p.type, if (p.enabled) "true" else "false",
                }) catch continue;
                output.writeRaw(line);
            }
            output.writeLine("");
            return;
        }

        var out: std.Io.Writer.Allocating = .init(gpa);
        defer out.deinit();
        var jw: std.json.Stringify = .{ .writer = &out.writer };
        jw.beginObject() catch return;
        jw.objectField("providers") catch return;
        jw.beginArray() catch return;
        for (providers) |p| {
            jw.beginObject() catch return;
            jw.objectField("name") catch return;
            jw.write(p.name) catch return;
            jw.objectField("type") catch return;
            jw.write(p.type) catch return;
            jw.objectField("enabled") catch return;
            jw.write(p.enabled) catch return;
            jw.objectField("roots") catch return;
            jw.beginArray() catch return;
            for (p.roots) |r| jw.write(r) catch return;
            jw.endArray() catch return;
            jw.endObject() catch return;
        }
        jw.endArray() catch return;
        jw.endObject() catch return;
        output.writeRaw(out.written());
        output.writeRaw("\n");
        return;
    }

    output.exitWithError(gpa, mode, .{
        .code = 85,
        .err_type = "invalid_argument",
        .message = "Unknown providers subcommand. Use: list",
        .recoverable = false,
    });
}
