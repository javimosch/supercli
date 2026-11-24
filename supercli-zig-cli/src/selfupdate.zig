// selfupdate.zig — cli-update-spec: `sc-zig update|install|uninstall` and the
// passive hourly nudge. Version endpoint is a committed docs/version-*.json
// served via raw.githubusercontent.com: {ok,version=sha256[:12],download,sha256}.
const std = @import("std");
const output = @import("output.zig");

const ENDPOINT_TMPL = "https://raw.githubusercontent.com/javimosch/supercli/master/docs/version-zig-{s}.json";
const BIN_NAME = "sc-zig";
const NUDGE_SKIP = [_][]const u8{ "update", "install", "uninstall", "version", "help", "help-json", "guide", "telemetry", "feedback", "install-as-sc" };

fn platform() []const u8 {
    const os = switch (@import("builtin").os.tag) {
        .linux => "linux",
        .macos => "darwin",
        else => "linux",
    };
    const arch = switch (@import("builtin").cpu.arch) {
        .x86_64 => "amd64",
        .aarch64 => "arm64",
        else => "amd64",
    };
    return os ++ "-" ++ arch;
}

fn endpointUrl(gpa: std.mem.Allocator, env: *const std.process.Environ.Map) []const u8 {
    if (env.get("SUPERCLI_UPDATE_URL")) |u| {
        if (u.len > 0) return u;
    }
    return std.fmt.allocPrint(gpa, ENDPOINT_TMPL, .{platform()}) catch "";
}

fn selfExePath(gpa: std.mem.Allocator) ?[]const u8 {
    var buf: [4096]u8 = undefined;
    const n = std.os.linux.readlink("/proc/self/exe", &buf, buf.len);
    if (n == 0 or n >= buf.len) return null;
    return std.fmt.allocPrint(gpa, "{s}", .{buf[0..n]}) catch null;
}

fn sha12(gpa: std.mem.Allocator, io: std.Io, path: []const u8) ?[]const u8 {
    const data = std.Io.Dir.cwd().readFileAlloc(io, path, gpa, .unlimited) catch return null;
    var digest: [32]u8 = undefined;
    std.crypto.hash.sha2.Sha256.hash(data, &digest, .{});
    const hex = "0123456789abcdef";
    var out = gpa.alloc(u8, 12) catch return null;
    for (digest[0..6], 0..) |b, i| {
        out[i * 2] = hex[b >> 4];
        out[i * 2 + 1] = hex[b & 0xf];
    }
    return out;
}

const Remote = struct { version: []const u8 = "", download: []const u8 = "", sha256: []const u8 = "" };

fn parseRemote(gpa: std.mem.Allocator, body: []const u8) Remote {
    var r: Remote = .{};
    const parsed = std.json.parseFromSliceLeaky(std.json.Value, gpa, body, .{}) catch return r;
    if (parsed != .object) return r;
    const ok = parsed.object.get("ok") orelse return r;
    if (ok != .bool or ok.bool != true) return r;
    if (parsed.object.get("version")) |v| {
        if (v == .string) r.version = v.string;
    }
    if (parsed.object.get("download")) |v| {
        if (v == .string) r.download = v.string;
    }
    if (parsed.object.get("sha256")) |v| {
        if (v == .string) r.sha256 = v.string;
    }
    return r;
}

fn fetchRemote(gpa: std.mem.Allocator, io: std.Io, url: []const u8) ?Remote {
    const res = std.process.run(gpa, io, .{
        .argv = &.{ "curl", "-sfSL", "-m", "8", url },
        .stdout_limit = .unlimited,
        .stderr_limit = .unlimited,
    }) catch return null;
    switch (res.term) {
        .exited => |c| {
            if (c != 0) return null;
        },
        else => return null,
    }
    const r = parseRemote(gpa, res.stdout);
    if (r.version.len == 0 or r.download.len == 0) return null;
    return r;
}

fn runOk(gpa: std.mem.Allocator, io: std.Io, argv: []const []const u8) bool {
    const res = std.process.run(gpa, io, .{ .argv = argv, .stdout_limit = .unlimited, .stderr_limit = .unlimited }) catch return false;
    return switch (res.term) {
        .exited => |c| c == 0,
        else => false,
    };
}

fn sha256hex(gpa: std.mem.Allocator, io: std.Io, path: []const u8) ?[]const u8 {
    const data = std.Io.Dir.cwd().readFileAlloc(io, path, gpa, .unlimited) catch return null;
    var digest: [32]u8 = undefined;
    std.crypto.hash.sha2.Sha256.hash(data, &digest, .{});
    const hex = "0123456789abcdef";
    var out = gpa.alloc(u8, 64) catch return null;
    for (digest, 0..) |b, i| {
        out[i * 2] = hex[b >> 4];
        out[i * 2 + 1] = hex[b & 0xf];
    }
    return out;
}

pub fn handleUpdate(gpa0: std.mem.Allocator, io: std.Io, mode: output.Mode, env: *const std.process.Environ.Map, check: bool, force: bool) noreturn {
    const gpa = std.heap.page_allocator;
    _ = gpa0;
    const self = selfExePath(gpa) orelse {
        output.exitWithError(gpa, mode, .{ .code = 110, .err_type = "internal_error", .message = "cannot resolve /proc/self/exe", .recoverable = false });
    };
    const local = sha12(gpa, io, self) orelse {
        output.exitWithError(gpa, mode, .{ .code = 110, .err_type = "internal_error", .message = "cannot hash own binary", .recoverable = false });
    };
    const url = endpointUrl(gpa, env);
    const remote = fetchRemote(gpa, io, url) orelse {
        output.exitWithError(gpa, mode, .{ .code = 100, .err_type = "external_failure", .message = "version endpoint unreachable", .recoverable = true });
    };

    if (!force and std.mem.eql(u8, local, remote.version)) {
        const line = std.fmt.allocPrint(gpa, "{{\"ok\":true,\"data\":{{\"up_to_date\":true,\"version\":\"{s}\"}}}}\n", .{local}) catch "";
        output.writeRaw(line);
        std.process.exit(0);
    }
    if (check) {
        const line = std.fmt.allocPrint(gpa,
            "{{\"ok\":true,\"data\":{{\"up_to_date\":false,\"current\":\"{s}\",\"available\":\"{s}\",\"download\":\"{s}\"}}}}\n",
            .{ local, remote.version, remote.download }) catch "";
        output.writeRaw(line);
        std.process.exit(5);
    }

    // download → verify → smoke test → atomic swap with .bak
    const pid = std.os.linux.getpid();
    const tmp = std.fmt.allocPrint(gpa, "{s}.new-{d}", .{ self, pid }) catch "";
    const bak = std.fmt.allocPrint(gpa, "{s}.bak", .{self}) catch "";

    if (!runOk(gpa, io, &.{ "curl", "-fsSL", "-m", "60", "-o", tmp, remote.download })) {
        output.exitWithError(gpa, mode, .{ .code = 100, .err_type = "external_failure", .message = "download failed", .recoverable = true });
    }
    defer std.Io.Dir.deleteFileAbsolute(io, tmp) catch {};

    if (remote.sha256.len == 64) {
        const got = sha256hex(gpa, io, tmp) orelse "";
        if (!std.mem.eql(u8, got, remote.sha256)) {
            output.exitWithError(gpa, mode, .{ .code = 100, .err_type = "external_failure", .message = "sha256 mismatch — download corrupt or tampered", .recoverable = false });
        }
    }
    _ = runOk(gpa, io, &.{ "chmod", "+x", tmp });
    if (!runOk(gpa, io, &.{ tmp, "--version" })) {
        output.exitWithError(gpa, mode, .{ .code = 100, .err_type = "external_failure", .message = "smoke test failed — downloaded binary does not run", .recoverable = false });
    }

    std.Io.Dir.renameAbsolute(self, bak, io) catch {
        output.exitWithError(gpa, mode, .{ .code = 90, .err_type = "permission", .message = "cannot move current binary aside (permission denied?)", .recoverable = false });
    };
    std.Io.Dir.renameAbsolute(tmp, self, io) catch {
        std.Io.Dir.renameAbsolute(bak, self, io) catch {};
        output.exitWithError(gpa, mode, .{ .code = 100, .err_type = "external_failure", .message = "swap failed — previous binary restored from .bak", .recoverable = false });
    };
    const line = std.fmt.allocPrint(gpa,
        "{{\"ok\":true,\"data\":{{\"updated\":true,\"previous\":\"{s}\",\"version\":\"{s}\",\"backup\":\"{s}\"}}}}\n",
        .{ local, remote.version, bak }) catch "";
    output.writeRaw(line);
    std.process.exit(0);
}

fn defaultPrefix(gpa: std.mem.Allocator, home: []const u8) []const u8 {
    return std.fmt.allocPrint(gpa, "{s}/.local/bin", .{home}) catch "";
}

pub fn handleInstall(gpa0: std.mem.Allocator, io: std.Io, mode: output.Mode, env: *const std.process.Environ.Map, home: []const u8, prefix_flag: []const u8) void {
    const gpa = std.heap.page_allocator;
    _ = gpa0;
    const prefix = if (prefix_flag.len > 0) prefix_flag else defaultPrefix(gpa, home);
    const self = selfExePath(gpa) orelse {
        output.exitWithError(gpa, mode, .{ .code = 110, .err_type = "internal_error", .message = "cannot resolve /proc/self/exe", .recoverable = false });
    };
    const dest = std.fmt.allocPrint(gpa, "{s}/{s}", .{ prefix, BIN_NAME }) catch "";
    _ = env;
    std.Io.Dir.cwd().createDirPath(io, prefix) catch {
        output.exitWithError(gpa, mode, .{ .code = 90, .err_type = "permission", .message = "cannot create --prefix directory", .recoverable = false });
    };
    const data = std.Io.Dir.cwd().readFileAlloc(io, self, gpa, .unlimited) catch {
        output.exitWithError(gpa, mode, .{ .code = 110, .err_type = "internal_error", .message = "cannot read own binary", .recoverable = false });
    };
    std.Io.Dir.cwd().writeFile(io, .{ .sub_path = dest, .data = data }) catch {
        output.exitWithError(gpa, mode, .{ .code = 90, .err_type = "permission", .message = "cannot write to --prefix (permission denied)", .recoverable = false });
    };
    _ = runOk(gpa, io, &.{ "chmod", "+x", dest });
    const line = std.fmt.allocPrint(gpa, "{{\"ok\":true,\"installed\":\"{s}\"}}\n", .{dest}) catch "";
    output.writeRaw(line);
}

pub fn handleUninstall(gpa0: std.mem.Allocator, io: std.Io, mode: output.Mode, home: []const u8, prefix_flag: []const u8) void {
    const gpa = std.heap.page_allocator;
    _ = gpa0;
    _ = mode;
    const prefix = if (prefix_flag.len > 0) prefix_flag else defaultPrefix(gpa, home);
    const dest = std.fmt.allocPrint(gpa, "{s}/{s}", .{ prefix, BIN_NAME }) catch "";
    var removed = false;
    if (std.Io.Dir.cwd().statFile(io, dest, .{}) catch null) |_| {
        std.Io.Dir.cwd().deleteFile(io, dest) catch {};
        removed = true;
    }
    const line = std.fmt.allocPrint(gpa, "{{\"ok\":true,\"removed\":{s},\"path\":\"{s}\"}}\n", .{ if (removed) "true" else "false", dest }) catch "";
    output.writeRaw(line);
}

// ----- passive nudge -------------------------------------------------------
// Cache file: ~/.supercli/update-cache-zig.json — refreshed by a detached
// child at most once per hour, so the nudge costs one file stat per run.

fn cacheDir(gpa: std.mem.Allocator, home: []const u8) []const u8 {
    return std.fmt.allocPrint(gpa, "{s}/.supercli", .{home}) catch "";
}

pub fn nudge(gpa0: std.mem.Allocator, io: std.Io, home: []const u8, env: *const std.process.Environ.Map, verb: []const u8) void {
    const gpa = std.heap.page_allocator;
    _ = gpa0;
    for (NUDGE_SKIP) |s| {
        if (std.mem.eql(u8, verb, s)) return;
    }
    if (env.get("SUPERCLI_NO_NUDGE")) |v| {
        if (v.len > 0) return;
    }
    const dir = cacheDir(gpa, home);
    const cache = std.fmt.allocPrint(gpa, "{s}/update-cache-zig.json", .{dir}) catch return;
    const now_s = std.Io.Timestamp.now(io, .real).toSeconds();

    const st = std.Io.Dir.cwd().statFile(io, cache, .{}) catch {
        spawnRefresh(gpa, io, dir, cache, env);
        return;
    };
    if (now_s - st.mtime.toSeconds() >= 3600) spawnRefresh(gpa, io, dir, cache, env);

    const body = std.Io.Dir.cwd().readFileAlloc(io, cache, gpa, .unlimited) catch return;
    const remote = parseRemote(gpa, body);
    if (remote.version.len == 0) return;

    const nudged = std.fmt.allocPrint(gpa, "{s}/update-zig-nudged", .{dir}) catch return;
    const last = std.Io.Dir.cwd().readFileAlloc(io, nudged, gpa, .unlimited) catch "";
    if (std.mem.eql(u8, std.mem.trim(u8, last, " \t\r\n"), remote.version)) return;

    const self = selfExePath(gpa) orelse return;
    const local = localHashCached(gpa, io, dir, self) orelse return;
    if (std.mem.eql(u8, local, remote.version)) return;

    std.Io.Dir.cwd().writeFile(io, .{ .sub_path = nudged, .data = remote.version }) catch {};
    const msg = std.fmt.allocPrint(gpa,
        "[update] a newer {s} is available ({s} -> {s}). Run: {s} update\n",
        .{ BIN_NAME, local, remote.version, BIN_NAME }) catch return;
    output.writeRawErr(msg);
}

// Hash of the running binary, cached by (size,mtime) so normal invocations
// only pay a stat, not a multi-MB sha256.
fn localHashCached(gpa: std.mem.Allocator, io: std.Io, dir: []const u8, self: []const u8) ?[]const u8 {
    const st = std.Io.Dir.cwd().statFile(io, self, .{}) catch return sha12(gpa, io, self);
    const stamp = std.fmt.allocPrint(gpa, "{d}:{d}", .{ st.size, st.mtime.toNanoseconds() }) catch return null;
    const cf = std.fmt.allocPrint(gpa, "{s}/update-zig-localhash", .{dir}) catch return null;
    if (std.Io.Dir.cwd().readFileAlloc(io, cf, gpa, .unlimited) catch null) |body| {
        const t = std.mem.trim(u8, body, " \t\r\n");
        if (std.mem.lastIndexOfScalar(u8, t, ':')) |i| {
            if (std.mem.eql(u8, t[0..i], stamp)) return t[i + 1 ..];
        }
    }
    const h = sha12(gpa, io, self) orelse return null;
    const rec = std.fmt.allocPrint(gpa, "{s}:{s}", .{ stamp, h }) catch return h;
    std.Io.Dir.cwd().writeFile(io, .{ .sub_path = cf, .data = rec }) catch {};
    return h;
}

fn spawnRefresh(gpa: std.mem.Allocator, io: std.Io, dir: []const u8, cache: []const u8, env: *const std.process.Environ.Map) void {
    const url = endpointUrl(gpa, env);
    const script = std.fmt.allocPrint(gpa,
        "mkdir -p '{s}' && curl -sfSL -m 8 '{s}' -o '{s}.tmp' && mv '{s}.tmp' '{s}'",
        .{ dir, url, cache, cache, cache }) catch return;
    var child = std.process.spawn(io, .{
        .argv = &.{ "sh", "-c", script },
        .stdin = .ignore,
        .stdout = .ignore,
        .stderr = .ignore,
    }) catch return;
    _ = &child;
}
