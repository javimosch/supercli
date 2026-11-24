// telemetry.zig — cli-telemetry-spec, shared consolidation ledger.
//
// One event per invocation is appended to ~/.supercli/telemetry.jsonl
// (shared with sc and sc-machin). At most once per hour, pending lines are
// flushed as a single JSON-array POST to grange.intrane.fr/t via a detached
// `sh -c 'curl ...'` child (sc-zig has no TLS). Opt-outs:
// SUPERCLI_TELEMETRY=0|off|false|no, DO_NOT_TRACK=1, `sc-zig telemetry --off`,
// or any CI environment.
const std = @import("std");
const output = @import("output.zig");

const ENDPOINT_DEFAULT = "https://grange.intrane.fr/t";
const RELAY_DEFAULT = "https://feedback.intrane.fr";
const VERSION = "0.1.0";
const FLUSH_INTERVAL_S: i64 = 3600;
const TRIM_LINES = 1000;
const TRIM_KEEP = 500;

var g_verb: []const u8 = "none";
var g_home: []const u8 = "/tmp";
var g_enabled: bool = false;
var g_endpoint: []const u8 = ENDPOINT_DEFAULT;
var g_off_reason: []const u8 = "unknown";
var g_gpa: std.mem.Allocator = undefined;
var g_io: std.Io = undefined;
var g_ready: bool = false;

fn pathJoin(gpa: std.mem.Allocator, name: []const u8) []const u8 {
    return std.fmt.allocPrint(gpa, "{s}/.supercli/{s}", .{ g_home, name }) catch "/tmp/.supercli/x";
}

fn fileExists(io: std.Io, path: []const u8) bool {
    _ = std.Io.Dir.cwd().statFile(io, path, .{}) catch return false;
    return true;
}

fn checkEnabled(env: *const std.process.Environ.Map) bool {
    if (env.get("DO_NOT_TRACK")) |v| {
        if (std.mem.eql(u8, v, "1")) {
            g_off_reason = "DO_NOT_TRACK=1";
            return false;
        }
    }
    if (env.get("SUPERCLI_TELEMETRY")) |v| {
        const low = std.ascii.allocLowerString(std.heap.page_allocator, v) catch v;
        if (std.mem.eql(u8, low, "0") or std.mem.eql(u8, low, "off") or
            std.mem.eql(u8, low, "false") or std.mem.eql(u8, low, "no"))
        {
            g_off_reason = "SUPERCLI_TELEMETRY=off";
            return false;
        }
    }
    for ([_][]const u8{ "CI", "CONTINUOUS_INTEGRATION", "GITHUB_ACTIONS", "GITLAB_CI", "BUILDKITE" }) |k| {
        if (env.get(k) != null) {
            g_off_reason = "CI detected";
            return false;
        }
    }
    return true;
}

fn nowSeconds(io: std.Io) i64 {
    return std.Io.Timestamp.now(io, .real).toSeconds();
}

fn eventJson(gpa: std.mem.Allocator, io: std.Io, event: []const u8, exit_class: i64) []const u8 {
    // Fixed allow-listed fields only: tool, version, event, verb, os, arch,
    // exit_class, ts. No identity, arguments, or paths.
    var ts_buf: [32]u8 = undefined;
    const ts = epochToIso(&ts_buf, nowSeconds(io));
    return std.fmt.allocPrint(gpa,
        "{{\"tool\":\"sc-zig\",\"version\":\"{s}\",\"event\":\"{s}\",\"verb\":\"{s}\",\"os\":\"{s}\",\"arch\":\"{s}\",\"exit_class\":{d},\"ts\":\"{s}\"}}",
        .{ VERSION, event, g_verb, @tagName(@import("builtin").os.tag), @tagName(@import("builtin").cpu.arch), exit_class, ts }) catch "";
}

fn epochToIso(buf: []u8, secs: i64) []const u8 {
    const days_s: i64 = 86400;
    const epoch_secs: u64 = @intCast(@max(0, secs));
    const es = std.time.epoch.EpochSeconds{ .secs = epoch_secs };
    const day = es.getEpochDay();
    const yd = day.calculateYearDay();
    const md = yd.calculateMonthDay();
    const ds = es.getDaySeconds();
    _ = days_s;
    return std.fmt.bufPrint(buf, "{d:0>4}-{d:0>2}-{d:0>2}T{d:0>2}:{d:0>2}:{d:0>2}Z", .{
        yd.year, md.month.numeric(), md.day_index + 1, ds.getHoursIntoDay(), ds.getMinutesIntoHour(), ds.getSecondsIntoMinute(),
    }) catch "1970-01-01T00:00:00Z";
}

fn exitClass(code: u8) i64 {
    if (code == 0) return 0;
    if (code >= 80 and code < 90) return 80;
    if (code >= 90 and code < 100) return 90;
    if (code >= 100 and code < 110) return 100;
    return 110;
}

/// Called once from main() — stores allocator/io for later hooks (including
/// output.exitWithError, which receives neither) and resolves on/off state.
pub fn init(io: std.Io, gpa: std.mem.Allocator, home: []const u8, env: *const std.process.Environ.Map, verb: []const u8) void {
    g_io = io;
    g_gpa = gpa;
    g_ready = true;
    g_home = home;
    g_verb = if (verb.len > 0) verb else "none";
    if (env.get("SUPERCLI_TELEMETRY_URL")) |ep| {
        if (ep.len > 0) g_endpoint = ep;
    }
    g_enabled = checkEnabled(env);
    if (g_enabled and fileExists(io, pathJoin(std.heap.page_allocator, "telemetry-off"))) {
        g_enabled = false;
        g_off_reason = "disabled by config (sc-zig telemetry --off)";
    }
}

fn notice(gpa: std.mem.Allocator, io: std.Io) void {
    const nf = pathJoin(gpa, "telemetry-notice-shown");
    if (fileExists(io, nf)) return;
    output.writeRaw("[telemetry] sc-zig sends anonymous usage counts: tool, version,\n");
    output.writeRaw("[telemetry] os/arch, which verb ran, and whether it failed. No identity,\n");
    output.writeRaw("[telemetry] arguments or data. Events consolidate locally and flush at\n");
    output.writeRaw("[telemetry] most once per hour. See `sc-zig telemetry` for the payload.\n");
    output.writeRaw("[telemetry] Disable: SUPERCLI_TELEMETRY=0 (or DO_NOT_TRACK=1)\n");
    std.Io.Dir.cwd().createDirPath(io, pathJoin(gpa, "..")) catch {};
    std.Io.Dir.cwd().writeFile(io, .{ .sub_path = nf, .data = "1" }) catch {};
}

fn record(gpa: std.mem.Allocator, io: std.Io, event: []const u8, code: u8) void {
    const ledger = pathJoin(gpa, "telemetry.jsonl");
    std.Io.Dir.cwd().createDirPath(io, pathJoin(gpa, "..")) catch {};
    const prev = std.Io.Dir.cwd().readFileAlloc(io, ledger, gpa, .unlimited) catch "";
    const line = eventJson(gpa, io, event, exitClass(code));
    const next = std.fmt.allocPrint(gpa, "{s}{s}\n", .{ prev, line }) catch return;
    std.Io.Dir.cwd().writeFile(io, .{ .sub_path = ledger, .data = next }) catch {};
}

// Flush: stamp the attempt marker first (bounds retries to <=1/h during
// outages), then hand the whole batch to a detached shell — curl posts the
// array and truncates the ledger only when the collector answers ok:true.
fn maybeFlush(gpa: std.mem.Allocator, io: std.Io) void {
    const ledger = pathJoin(gpa, "telemetry.jsonl");
    const tf = pathJoin(gpa, "telemetry-flush.ts");
    if (std.Io.Dir.cwd().statFile(io, tf, .{}) catch null) |st| {
        if (nowSeconds(io) - st.mtime.toSeconds() < FLUSH_INTERVAL_S) return;
    }
    const body = std.Io.Dir.cwd().readFileAlloc(io, ledger, gpa, .unlimited) catch return;
    if (std.mem.trim(u8, body, " \t\r\n").len == 0) return;

    var ts_buf: [24]u8 = undefined;
    const ts_str = std.fmt.bufPrint(&ts_buf, "{d}", .{nowSeconds(io)}) catch return;
    std.Io.Dir.cwd().writeFile(io, .{ .sub_path = tf, .data = ts_str }) catch return;

    // Build the JSON array; trim oversized ledgers to the newest entries.
    var lines: std.ArrayList([]const u8) = .empty;
    var it = std.mem.splitScalar(u8, std.mem.trim(u8, body, " \t\r\n"), '\n');
    while (it.next()) |l| {
        if (l.len > 0) lines.append(gpa, l) catch break;
    }
    var keep = lines.items;
    if (keep.len > TRIM_LINES) keep = keep[keep.len - TRIM_KEEP ..];
    const batch = std.mem.join(gpa, ",", keep) catch return;
    const batch_path = pathJoin(gpa, "telemetry-batch.json");
    const wrapped = std.fmt.allocPrint(gpa, "[{s}]", .{batch}) catch return;
    std.Io.Dir.cwd().writeFile(io, .{ .sub_path = batch_path, .data = wrapped }) catch return;

    const script = std.fmt.allocPrint(gpa,
        "curl -sf -m 5 -X POST -H 'content-type: application/json' -d @{s} '{s}' | grep -qE '\"ok\" *: *true' && : > '{s}'",
        .{ batch_path, g_endpoint, ledger }) catch return;
    var child = std.process.spawn(io, .{
        .argv = &.{ "sh", "-c", script },
        .stdin = .ignore,
        .stdout = .ignore,
        .stderr = .ignore,
    }) catch return;
    _ = &child; // detached on purpose — parent exits, init reaps
}

/// Called once per invocation with the final exit code (or 0 on success) —
/// from main's defer for normal/error-union returns, and from
/// output.exitWithError for typed errors.
pub fn finish(code: u8) void {
    if (!g_ready or !g_enabled) return;
    notice(g_gpa, g_io);
    const marker = pathJoin(g_gpa, "telemetry-install-sent");
    var event: []const u8 = if (code == 0) "run" else "error";
    if (!fileExists(g_io, marker)) {
        event = "install";
        std.Io.Dir.cwd().createDirPath(g_io, pathJoin(g_gpa, "..")) catch {};
        std.Io.Dir.cwd().writeFile(g_io, .{ .sub_path = marker, .data = "1" }) catch {};
    }
    record(g_gpa, g_io, event, code);
    maybeFlush(g_gpa, g_io);
}

fn pendingCount(gpa: std.mem.Allocator, io: std.Io) usize {
    const body = std.Io.Dir.cwd().readFileAlloc(io, pathJoin(gpa, "telemetry.jsonl"), gpa, .unlimited) catch return 0;
    const t = std.mem.trim(u8, body, " \t\r\n");
    if (t.len == 0) return 0;
    return std.mem.count(u8, t, "\n") + 1;
}

pub fn handleTelemetry(gpa: std.mem.Allocator, io: std.Io, mode: output.Mode, env: *const std.process.Environ.Map, off: bool) void {
    const a = std.heap.page_allocator;
    if (off) {
        std.Io.Dir.cwd().createDirPath(io, pathJoin(a, "..")) catch {};
        std.Io.Dir.cwd().writeFile(io, .{ .sub_path = pathJoin(a, "telemetry-off"), .data = "1" }) catch {};
        output.writeRaw("{\"ok\":true,\"data\":{\"enabled\":false,\"reason\":\"disabled by config\"}}\n");
        return;
    }
    const pending = pendingCount(a, io);
    const sample = eventJson(a, io, "run", 0);
    const reason = if (g_enabled) "enabled" else g_off_reason;
    const json = std.fmt.allocPrint(a,
        "{{\"ok\":true,\"data\":{{\"enabled\":{s},\"reason\":\"{s}\",\"endpoint\":\"{s}\",\"consolidation\":\"local ledger, flush <= 1/hour\",\"pending_events\":{d},\"next_payload\":{s},\"disable\":\"SUPERCLI_TELEMETRY=0\"}}}}\n",
        .{ if (g_enabled) "true" else "false", reason, g_endpoint, pending, sample }) catch return;
    _ = gpa;
    _ = env;
    _ = mode;
    output.writeRaw(json);
}

fn jsonEscape(gpa: std.mem.Allocator, s: []const u8) []const u8 {
    var out: std.ArrayList(u8) = .empty;
    for (s) |c| {
        switch (c) {
            '"' => out.appendSlice(gpa, "\\\"") catch {},
            '\\' => out.appendSlice(gpa, "\\\\") catch {},
            '\n' => out.appendSlice(gpa, "\\n") catch {},
            '\r' => out.appendSlice(gpa, "\\r") catch {},
            '\t' => out.appendSlice(gpa, "\\t") catch {},
            else => {
                if (c < 0x20) {
                    var b: [8]u8 = undefined;
                    const e = std.fmt.bufPrint(&b, "\\u{x:0>4}", .{c}) catch "";
                    out.appendSlice(gpa, e) catch {};
                } else {
                    out.append(gpa, c) catch {};
                }
            },
        }
    }
    return out.items;
}

// feedback — cli-feedback-spec, relay-only. curl does TLS; never fails caller.
pub fn handleFeedback(gpa: std.mem.Allocator, io: std.Io, mode: output.Mode, env: *const std.process.Environ.Map, message: []const u8, kind: []const u8, context: []const u8) void {
    if (std.mem.trim(u8, message, " \t\r\n").len == 0) {
        output.exitWithError(gpa, mode, .{
            .code = 85,
            .err_type = "invalid_argument",
            .message = "Usage: sc-zig feedback <message> [--kind bug|idea|praise|note] [--context txt]",
            .recoverable = false,
        });
    }
    var id_buf: [8]u8 = undefined;
    const got = std.os.linux.getrandom(&id_buf, id_buf.len, 0);
    if (got != id_buf.len) {
        const seed: u64 = @intCast(@max(0, nowSeconds(io) *% 1000003 +% @as(i64, std.os.linux.getpid())));
        std.mem.writeInt(u64, &id_buf, seed, .little);
    }
    var id: []const u8 = "";
    {
        const hex = "0123456789abcdef";
        var id_str: [16]u8 = undefined;
        for (id_buf, 0..) |b, i| {
            id_str[i * 2] = hex[b >> 4];
            id_str[i * 2 + 1] = hex[b & 0xf];
        }
        id = std.fmt.allocPrint(gpa, "{s}", .{id_str}) catch "";
    }
    const reporter = env.get("USER") orelse env.get("USERNAME") orelse "agent";
    const body = std.fmt.allocPrint(gpa,
        "{{\"message\":\"{s}\",\"app\":\"sc-zig\",\"version\":\"{s}\",\"kind\":\"{s}\",\"context\":\"{s}\",\"reporter\":\"{s}\",\"id\":\"{s}\"}}",
        .{ jsonEscape(gpa, message), VERSION, jsonEscape(gpa, kind), jsonEscape(gpa, context), jsonEscape(gpa, reporter), id }) catch "";

    var relayed: u8 = 0;
    const relay = env.get("FEEDBACK_RELAY") orelse RELAY_DEFAULT;
    if (!std.mem.eql(u8, relay, "off")) {
        const url = std.fmt.allocPrint(gpa, "{s}/v1/feedback", .{relay}) catch "";
        if (std.process.run(gpa, io, .{
            .argv = &.{ "curl", "-sf", "-m", "5", "-X", "POST", "-H", "content-type: application/json", "-d", body, url },
        }) catch null) |res| {
            if (std.mem.indexOf(u8, res.stdout, "\"ok\":true") != null or
                std.mem.indexOf(u8, res.stdout, "\"ok\": true") != null) relayed = 1;
        }
    }
    const resp = std.fmt.allocPrint(gpa,
        "{{\"ok\":true,\"data\":{{\"id\":\"{s}\",\"stored\":0,\"relayed\":{d}}}}}\n",
        .{ id, relayed }) catch return;
    output.writeRaw(resp);
}
