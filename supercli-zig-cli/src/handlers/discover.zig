// discover.zig — discover --intent "<task>": tokenize, score, rank plugins
// Mirrors cli/discover.js logic (no LLM, pure keyword scoring).
const std = @import("std");
const output = @import("../output.zig");
const registry = @import("../registry.zig");
const lockfile = @import("../lockfile.zig");

const plugins_handler = @import("plugins.zig");

const STOPWORDS = [_][]const u8{
    "a", "an", "and", "as", "at", "be", "by", "do", "for", "from", "get",
    "how", "i", "in", "into", "is", "it", "me", "of", "on", "or",
    "please", "that", "the", "this", "to", "use", "with",
};

fn isStopword(word: []const u8) bool {
    for (STOPWORDS) |sw| {
        if (std.mem.eql(u8, word, sw)) return true;
    }
    return false;
}

fn applySynonym(token: []const u8) ?[]const u8 {
    const synonyms = [_]struct { from: []const u8, to: []const u8 }{
        .{ .from = "mail", .to = "email" },
        .{ .from = "mailbox", .to = "email" },
        .{ .from = "gmail", .to = "email" },
        .{ .from = "smtp", .to = "email" },
        .{ .from = "browse", .to = "browser" },
        .{ .from = "browsing", .to = "browser" },
        .{ .from = "browseruse", .to = "browser-use" },
        .{ .from = "web", .to = "browser" },
        .{ .from = "tweet", .to = "twitter" },
        .{ .from = "tweets", .to = "twitter" },
        .{ .from = "gcp", .to = "google-cloud" },
        .{ .from = "k8s", .to = "kubernetes" },
    };
    for (synonyms) |syn| {
        if (std.mem.eql(u8, token, syn.from)) return syn.to;
    }
    return null;
}

fn tokenize(gpa: std.mem.Allocator, intent: []const u8) ![][]const u8 {
    var tokens: std.ArrayList([]const u8) = .empty;
    var lower = try std.ascii.allocLowerString(gpa, intent);
    defer gpa.free(lower);

    // Replace non-alphanumeric (keep hyphens) with spaces
    for (lower, 0..) |c, i| {
        if (!(std.ascii.isAlphanumeric(c) or c == '-' or c == ' ')) {
            lower[i] = ' ';
        }
    }

    var iter = std.mem.tokenizeAny(u8, lower, " ");
    while (iter.next()) |raw_tok| {
        const tok = std.mem.trim(u8, raw_tok, " ");
        if (tok.len == 0) continue;
        if (isStopword(tok)) continue;

        const owned = try gpa.dupe(u8, tok);
        try tokens.append(gpa, owned);

        if (applySynonym(tok)) |syn| {
            // Avoid duplicates
            var found = false;
            for (tokens.items) |t| {
                if (std.mem.eql(u8, t, syn)) { found = true; break; }
            }
            if (!found) {
                try tokens.append(gpa, try gpa.dupe(u8, syn));
            }
        }
    }
    return tokens.toOwnedSlice(gpa);
}

fn countHits(text: []const u8, tokens: [][]const u8, gpa: std.mem.Allocator) ![][]const u8 {
    var hits: std.ArrayList([]const u8) = .empty;
    const lower = try std.ascii.allocLowerString(gpa, text);
    defer gpa.free(lower);
    for (tokens) |t| {
        if (std.mem.indexOf(u8, lower, t) != null) {
            try hits.append(gpa, t);
        }
    }
    return hits.toOwnedSlice(gpa);
}

const ScoredPlugin = struct {
    plugin: registry.RegistryPlugin,
    score: usize,
    base_score: usize,
    matched_tokens: [][]const u8,
    installed: bool,
};

pub fn handleDiscover(
    io: std.Io,
    gpa: std.mem.Allocator,
    mode: output.Mode,
    flags: std.StringHashMap([]const u8),
    home: []const u8,
) !void {
    const intent = flags.get("intent") orelse "";
    if (intent.len == 0) {
        output.exitWithError(gpa, mode, .{
            .code = 85,
            .err_type = "invalid_argument",
            .message = "Missing --intent text",
            .recoverable = false,
            .suggestions = &.{"Run: sc-zig discover --intent \"send email\" --json"},
        });
    }

    const limit: usize = blk: {
        const limit_str = flags.get("limit") orelse "5";
        break :blk std.fmt.parseInt(usize, limit_str, 10) catch 5;
    };

    var arena = std.heap.ArenaAllocator.init(gpa);
    defer arena.deinit();
    const arena_alloc = arena.allocator();

    // Tokenize intent
    const tokens = try tokenize(arena_alloc, intent);

    // Get all registry plugins
    const plugins_dir = try plugins_handler.bundledPluginsDir(arena_alloc, io, home);
    const all_plugins = try registry.discoverPluginsInDir(io, arena_alloc, plugins_dir);

    // Get installed set
    const lock_raw = lockfile.readLockRaw(io, arena_alloc, home) catch null;
    var installed_count: usize = 0;
    if (lock_raw) |lock| {
        installed_count = lockfile.countInstalled(lock);
    }

    // Score each plugin
    var scored: std.ArrayList(ScoredPlugin) = .empty;
    for (all_plugins) |plugin| {
        const name_hits = try countHits(plugin.name, tokens, arena_alloc);
        var tag_hits: std.ArrayList([]const u8) = .empty;
        for (plugin.tags) |tag| {
            const th = try countHits(tag, tokens, arena_alloc);
            for (th) |t| try tag_hits.append(arena_alloc, t);
        }
        const desc_hits = try countHits(plugin.description, tokens, arena_alloc);

        const base_score = name_hits.len * 6 + tag_hits.items.len * 5 + desc_hits.len * 2;

        if (base_score == 0) continue;

        var score = base_score;

        // Phrase match bonus
        const phrase_lower = try std.ascii.allocLowerString(arena_alloc, intent);
        const all_text = try std.fmt.allocPrint(arena_alloc, "{s} {s}", .{ plugin.name, plugin.description });
        const all_lower = try std.ascii.allocLowerString(arena_alloc, all_text);
        if (phrase_lower.len > 2 and std.mem.indexOf(u8, all_lower, phrase_lower) != null) {
            score += 4;
        }

        // Installed bonus
        var is_installed = false;
        if (lock_raw) |lock| {
            if (lockfile.getPluginEntry(lock, plugin.name) != null) {
                is_installed = true;
                score += 1;
            }
        }

        // has_learn bonus
        if (plugin.has_learn) score += 1;

        // Collect matched tokens
        var matched: std.ArrayList([]const u8) = .empty;
        for (name_hits) |t| try matched.append(arena_alloc, t);
        for (tag_hits.items) |t| {
            var dup = false;
            for (matched.items) |m| { if (std.mem.eql(u8, m, t)) { dup = true; break; } }
            if (!dup) try matched.append(arena_alloc, t);
        }
        for (desc_hits) |t| {
            var dup = false;
            for (matched.items) |m| { if (std.mem.eql(u8, m, t)) { dup = true; break; } }
            if (!dup) try matched.append(arena_alloc, t);
        }

        try scored.append(arena_alloc, .{
            .plugin = plugin,
            .score = score,
            .base_score = base_score,
            .matched_tokens = try matched.toOwnedSlice(arena_alloc),
            .installed = is_installed,
        });
    }

    // Sort by score descending, then name ascending
    std.mem.sort(ScoredPlugin, scored.items, {}, struct {
        fn lt(_: void, a: ScoredPlugin, b: ScoredPlugin) bool {
            if (b.score != a.score) return b.score < a.score;
            return std.mem.lessThan(u8, a.plugin.name, b.plugin.name);
        }
    }.lt);

    const total = scored.items.len;
    const returned = @min(limit, total);

    if (mode == .human) {
        var buf: [256]u8 = undefined;
        const header = std.fmt.bufPrint(&buf, "\n  Discovery: \"{s}\"\n  Tokens: {s}\n  Candidates: {d}\n\n", .{
            intent,
            if (tokens.len > 0) tokens[0] else "",
            total,
        }) catch "";
        output.writeRaw(header);
        for (scored.items[0..returned]) |s| {
            var buf2: [256]u8 = undefined;
            const line = std.fmt.bufPrint(&buf2, "  {s} (score: {d}) — {s}\n", .{
                s.plugin.name, s.score, s.plugin.description,
            }) catch continue;
            output.writeRaw(line);
        }
        output.writeLine("");
        return;
    }

    // JSON output
    var out: std.Io.Writer.Allocating = .init(gpa);
    defer out.deinit();
    var jw: std.json.Stringify = .{ .writer = &out.writer };
    jw.beginObject() catch return;
    jw.objectField("intent") catch return;
    jw.write(intent) catch return;
    jw.objectField("tokens") catch return;
    jw.beginArray() catch return;
    for (tokens) |t| jw.write(t) catch return;
    jw.endArray() catch return;
    jw.objectField("no_llm") catch return;
    jw.write(true) catch return;
    jw.objectField("total_candidates") catch return;
    jw.write(total) catch return;
    jw.objectField("returned") catch return;
    jw.write(returned) catch return;
    jw.objectField("plugins") catch return;
    jw.beginArray() catch return;
    for (scored.items[0..returned]) |s| {
        jw.beginObject() catch return;
        jw.objectField("name") catch return;
        jw.write(s.plugin.name) catch return;
        jw.objectField("description") catch return;
        jw.write(s.plugin.description) catch return;
        jw.objectField("tags") catch return;
        jw.beginArray() catch return;
        for (s.plugin.tags) |tag| jw.write(tag) catch return;
        jw.endArray() catch return;
        jw.objectField("installed") catch return;
        jw.write(s.installed) catch return;
        jw.objectField("has_learn") catch return;
        jw.write(s.plugin.has_learn) catch return;
        jw.objectField("score") catch return;
        jw.write(s.score) catch return;
        jw.objectField("matched_tokens") catch return;
        jw.beginArray() catch return;
        for (s.matched_tokens) |t| jw.write(t) catch return;
        jw.endArray() catch return;
        jw.objectField("next_steps") catch return;
        jw.beginArray() catch return;
        if (s.plugin.has_learn) {
            const step = std.fmt.allocPrint(gpa, "sc-zig plugins learn {s} --json", .{s.plugin.name}) catch "";
            defer gpa.free(step);
            jw.write(step) catch return;
        }
        if (!s.installed) {
            const step2 = std.fmt.allocPrint(gpa, "sc-zig plugins install {s}", .{s.plugin.name}) catch "";
            defer gpa.free(step2);
            jw.write(step2) catch return;
        }
        jw.endArray() catch return;
        jw.endObject() catch return;
    }
    jw.endArray() catch return;
    jw.endObject() catch return;
    output.writeRaw(out.written());
    output.writeRaw("\n");
}
