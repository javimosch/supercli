const std = @import("std");
const th = @import("../../test_helpers.zig");
const mod = @import("../../handlers/discover.zig");
const config = @import("../../config.zig");

const isStopword = mod.isStopword;
const applySynonym = mod.applySynonym;
const tokenize = mod.tokenize;
const countHits = mod.countHits;
const handleDiscover = mod.handleDiscover;
const writeBundledPluginWithMeta = mod.writeBundledPluginWithMeta;
const writeLockWithPlugin = mod.writeLockWithPlugin;

test "isStopword recognizes common stopwords" {
    const testing = std.testing;

    try testing.expect(isStopword("the"));
    try testing.expect(isStopword("a"));
    try testing.expect(isStopword("an"));
    try testing.expect(isStopword("for"));
    try testing.expect(isStopword("with"));
    try testing.expect(isStopword("to"));
    try testing.expect(isStopword("use"));
    try testing.expect(isStopword("please"));
}

test "isStopword returns false for non-stopwords" {
    const testing = std.testing;

    try testing.expect(!isStopword("email"));
    try testing.expect(!isStopword("browser"));
    try testing.expect(!isStopword("kubernetes"));
    try testing.expect(!isStopword("database"));
    try testing.expect(!isStopword("send"));
}

test "applySynonym maps known synonyms" {
    const testing = std.testing;

    try testing.expectEqualStrings("email", applySynonym("mail").?);
    try testing.expectEqualStrings("email", applySynonym("mailbox").?);
    try testing.expectEqualStrings("email", applySynonym("gmail").?);
    try testing.expectEqualStrings("email", applySynonym("smtp").?);
    try testing.expectEqualStrings("browser", applySynonym("browse").?);
    try testing.expectEqualStrings("browser", applySynonym("browsing").?);
    try testing.expectEqualStrings("browser", applySynonym("web").?);
    try testing.expectEqualStrings("twitter", applySynonym("tweet").?);
    try testing.expectEqualStrings("twitter", applySynonym("tweets").?);
    try testing.expectEqualStrings("google-cloud", applySynonym("gcp").?);
    try testing.expectEqualStrings("kubernetes", applySynonym("k8s").?);
}

test "applySynonym returns null for non-synonyms" {
    const testing = std.testing;

    try testing.expect(applySynonym("database") == null);
    try testing.expect(applySynonym("email") == null);
    try testing.expect(applySynonym("browser") == null);
    try testing.expect(applySynonym("unknown") == null);
}

test "tokenize extracts meaningful tokens from intent" {
    const testing = std.testing;
    const gpa = testing.allocator;

    const tokens = try tokenize(gpa, "I need to send an email");
    defer {
        for (tokens) |t| gpa.free(t);
        gpa.free(tokens);
    }

    // "i", "to", "an" are stopwords; "need", "send" are kept; "email" is kept
    // "mail" is not in the input but "email" synonym would not be added since "email" is already a token
    try testing.expect(tokens.len >= 2);

    var found_send = false;
    var found_email = false;
    for (tokens) |t| {
        if (std.mem.eql(u8, t, "send")) found_send = true;
        if (std.mem.eql(u8, t, "email")) found_email = true;
    }
    try testing.expect(found_send);
    try testing.expect(found_email);
}

test "tokenize adds synonyms for mapped words" {
    const testing = std.testing;
    const gpa = testing.allocator;

    const tokens = try tokenize(gpa, "send mail please");
    defer {
        for (tokens) |t| gpa.free(t);
        gpa.free(tokens);
    }

    // "please" is a stopword, "send" is kept, "mail" -> adds "email" synonym
    var found_send = false;
    var found_mail = false;
    var found_email = false;
    for (tokens) |t| {
        if (std.mem.eql(u8, t, "send")) found_send = true;
        if (std.mem.eql(u8, t, "mail")) found_mail = true;
        if (std.mem.eql(u8, t, "email")) found_email = true;
    }
    try testing.expect(found_send);
    try testing.expect(found_mail);
    try testing.expect(found_email);
}

test "tokenize handles empty intent" {
    const testing = std.testing;
    const gpa = testing.allocator;

    const tokens = try tokenize(gpa, "");
    defer gpa.free(tokens);
    try testing.expectEqual(@as(usize, 0), tokens.len);
}

test "tokenize handles all-stopword intent" {
    const testing = std.testing;
    const gpa = testing.allocator;

    const tokens = try tokenize(gpa, "the a an to for with");
    defer gpa.free(tokens);
    try testing.expectEqual(@as(usize, 0), tokens.len);
}

test "tokenize lowercases input" {
    const testing = std.testing;
    const gpa = testing.allocator;

    const tokens = try tokenize(gpa, "SEND EMAIL");
    defer {
        for (tokens) |t| gpa.free(t);
        gpa.free(tokens);
    }

    var found_send = false;
    var found_email = false;
    for (tokens) |t| {
        if (std.mem.eql(u8, t, "send")) found_send = true;
        if (std.mem.eql(u8, t, "email")) found_email = true;
    }
    try testing.expect(found_send);
    try testing.expect(found_email);
}

test "tokenize replaces non-alphanumeric with spaces" {
    const testing = std.testing;
    const gpa = testing.allocator;

    const tokens = try tokenize(gpa, "send/email!");
    defer {
        for (tokens) |t| gpa.free(t);
        gpa.free(tokens);
    }

    var found_send = false;
    var found_email = false;
    for (tokens) |t| {
        if (std.mem.eql(u8, t, "send")) found_send = true;
        if (std.mem.eql(u8, t, "email")) found_email = true;
    }
    try testing.expect(found_send);
    try testing.expect(found_email);
}

test "countHits finds matching tokens in text" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var tokens = [_][]const u8{ "email", "browser", "database" };
    const hits = try countHits("email client tool", &tokens, gpa);
    defer gpa.free(hits);

    try testing.expectEqual(@as(usize, 1), hits.len);
    try testing.expectEqualStrings("email", hits[0]);
}

test "countHits is case insensitive" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var tokens = [_][]const u8{ "email", "browser" };
    const hits = try countHits("EMAIL and BROWSER tools", &tokens, gpa);
    defer gpa.free(hits);

    try testing.expectEqual(@as(usize, 2), hits.len);
}

test "countHits returns empty for no matches" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var tokens = [_][]const u8{ "email", "browser" };
    const hits = try countHits("database tool", &tokens, gpa);
    defer gpa.free(hits);

    try testing.expectEqual(@as(usize, 0), hits.len);
}

test "countHits handles empty tokens" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var tokens = [_][]const u8{};
    const hits = try countHits("some text", &tokens, gpa);
    defer gpa.free(hits);

    try testing.expectEqual(@as(usize, 0), hits.len);
}

test "handleDiscover JSON output with matching plugin" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var threaded = th.makeIo(gpa);
    defer threaded.deinit();
    const io = threaded.io();

    const home = try th.createTempHome(gpa, "discover");
    defer gpa.free(home);
    defer th.removeTempHome(gpa, home);

    // Write a bundled plugin that matches the intent "send email".
    const plugin_json =
        \\{"name":"mail-cli","commands":[]}
    ;
    const meta_json =
        \\{"description":"Email sending tool","tags":["email"],"has_learn":true}
    ;
    try writeBundledPluginWithMeta(gpa, io, home, "mail-cli", plugin_json, meta_json);

    var flags = std.StringHashMap([]const u8).init(gpa);
    defer flags.deinit();
    try flags.put("intent", "send email");

    var cap = th.OutputCapture{ .alloc = gpa };
    cap.install();
    defer cap.release();

    try handleDiscover(io, gpa, .json, flags, home);

    const parsed = try th.parseJson(gpa, cap.stdout());
    defer parsed.deinit();

    const root = parsed.value.object;
    try testing.expectEqualStrings("send email", root.get("intent").?.string);
    try testing.expectEqual(true, root.get("no_llm").?.bool);
    try testing.expectEqual(@as(i64, 1), root.get("total_candidates").?.integer);
    try testing.expectEqual(@as(i64, 1), root.get("returned").?.integer);

    const tokens = root.get("tokens").?.array;
    try testing.expectEqual(@as(usize, 2), tokens.items.len);
    try testing.expectEqualStrings("send", tokens.items[0].string);
    try testing.expectEqualStrings("email", tokens.items[1].string);

    const plugins = root.get("plugins").?.array;
    try testing.expectEqual(@as(usize, 1), plugins.items.len);
    const p0 = plugins.items[0].object;
    try testing.expectEqualStrings("mail-cli", p0.get("name").?.string);
    try testing.expectEqualStrings("Email sending tool", p0.get("description").?.string);
    try testing.expectEqual(false, p0.get("installed").?.bool);
    try testing.expectEqual(true, p0.get("has_learn").?.bool);
    // base_score = 0*6 (name) + 1*5 (tag) + 2*2 (desc) = 9; +1 has_learn = 10
    try testing.expectEqual(@as(i64, 10), p0.get("score").?.integer);

    const matched = p0.get("matched_tokens").?.array;
    try testing.expectEqual(@as(usize, 2), matched.items.len);

    const next_steps = p0.get("next_steps").?.array;
    try testing.expectEqual(@as(usize, 2), next_steps.items.len);
    try testing.expectEqualStrings("sc-zig plugins learn mail-cli --json", next_steps.items[0].string);
    try testing.expectEqualStrings("sc-zig plugins install mail-cli", next_steps.items[1].string);
}

test "handleDiscover JSON output with installed plugin" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var threaded = th.makeIo(gpa);
    defer threaded.deinit();
    const io = threaded.io();

    const home = try th.createTempHome(gpa, "discover-installed");
    defer gpa.free(home);
    defer th.removeTempHome(gpa, home);

    // Install mail-cli in the lockfile, then also write the bundled manifest.
    try writeLockWithPlugin(gpa, io, home, "mail-cli");
    const plugin_json =
        \\{"name":"mail-cli","commands":[]}
    ;
    const meta_json =
        \\{"description":"Email sending tool","tags":["email"],"has_learn":true}
    ;
    try writeBundledPluginWithMeta(gpa, io, home, "mail-cli", plugin_json, meta_json);

    var flags = std.StringHashMap([]const u8).init(gpa);
    defer flags.deinit();
    try flags.put("intent", "send email");

    var cap = th.OutputCapture{ .alloc = gpa };
    cap.install();
    defer cap.release();

    try handleDiscover(io, gpa, .json, flags, home);

    const parsed = try th.parseJson(gpa, cap.stdout());
    defer parsed.deinit();

    const root = parsed.value.object;
    try testing.expectEqual(@as(i64, 1), root.get("total_candidates").?.integer);

    const plugins = root.get("plugins").?.array;
    try testing.expectEqual(@as(usize, 1), plugins.items.len);
    const p0 = plugins.items[0].object;
    try testing.expectEqualStrings("mail-cli", p0.get("name").?.string);
    try testing.expectEqual(true, p0.get("installed").?.bool);
    // base_score = 9; +1 installed; +1 has_learn = 11
    try testing.expectEqual(@as(i64, 11), p0.get("score").?.integer);

    // Installed plugin: only the learn step, no install step.
    const next_steps = p0.get("next_steps").?.array;
    try testing.expectEqual(@as(usize, 1), next_steps.items.len);
    try testing.expectEqualStrings("sc-zig plugins learn mail-cli --json", next_steps.items[0].string);
}

test "handleDiscover JSON output with no matching plugins" {
    const testing = std.testing;
    const gpa = testing.allocator;

    var threaded = th.makeIo(gpa);
    defer threaded.deinit();
    const io = threaded.io();

    const home = try th.createTempHome(gpa, "discover-empty");
    defer gpa.free(home);
    defer th.removeTempHome(gpa, home);

    // Write a plugin that does NOT match the intent.
    const plugin_json =
        \\{"name":"uuid-cli","commands":[]}
    ;
    const meta_json =
        \\{"description":"UUID generator","tags":["util"],"has_learn":false}
    ;
    try writeBundledPluginWithMeta(gpa, io, home, "uuid-cli", plugin_json, meta_json);

    var flags = std.StringHashMap([]const u8).init(gpa);
    defer flags.deinit();
    try flags.put("intent", "send email");

    var cap = th.OutputCapture{ .alloc = gpa };
    cap.install();
    defer cap.release();

    try handleDiscover(io, gpa, .json, flags, home);

    const parsed = try th.parseJson(gpa, cap.stdout());
    defer parsed.deinit();

    const root = parsed.value.object;
    try testing.expectEqualStrings("send email", root.get("intent").?.string);
    try testing.expectEqual(@as(i64, 0), root.get("total_candidates").?.integer);
    try testing.expectEqual(@as(i64, 0), root.get("returned").?.integer);
    try testing.expectEqual(@as(usize, 0), root.get("plugins").?.array.items.len);
}
