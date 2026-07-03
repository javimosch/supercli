// daemon.zig — `sc daemon start/stop/status` — PID file management
// Minimal implementation: PID file at ~/.supercli/daemon.pid
const std = @import("std");
const output = @import("../output.zig");

fn pidFilePath(gpa: std.mem.Allocator, home: []const u8) ![]const u8 {
    return std.fmt.allocPrint(gpa, "{s}/.supercli/daemon.pid", .{home});
}

pub fn handleDaemon(
    io: std.Io,
    gpa: std.mem.Allocator,
    mode: output.Mode,
    pos: [][]const u8,
    home: []const u8,
) !void {
    const sub = if (pos.len > 1) pos[1] else "";

    if (std.mem.eql(u8, sub, "start")) {
        try daemonStart(io, gpa, mode, home);
    } else if (std.mem.eql(u8, sub, "stop")) {
        try daemonStop(io, gpa, mode, home);
    } else if (std.mem.eql(u8, sub, "status")) {
        try daemonStatus(io, gpa, mode, home);
    } else {
        output.exitWithError(gpa, mode, .{
            .code = 85,
            .err_type = "invalid_argument",
            .message = "Usage: sc-zig daemon <start|stop|status>",
            .recoverable = false,
        });
    }
}

fn daemonStart(io: std.Io, gpa: std.mem.Allocator, mode: output.Mode, home: []const u8) !void {
    const pid_path = try pidFilePath(gpa, home);
    defer gpa.free(pid_path);

    // Check if already running
    if (readPidFile(io, pid_path)) |existing_pid| {
        if (isProcessAlive(existing_pid)) {
            output.exitWithError(gpa, mode, .{
                .code = 85,
                .err_type = "invalid_argument",
                .message = "Daemon already running",
                .recoverable = false,
                .suggestions = &.{"sc-zig daemon stop"},
            });
        }
    }

    // Write current PID
    const pid = std.os.linux.getpid();
    var pid_buf: [32]u8 = undefined;
    const pid_str = std.fmt.bufPrint(&pid_buf, "{d}\n", .{pid}) catch return;

    std.Io.Dir.cwd().writeFile(io, .{ .sub_path = pid_path, .data = pid_str }) catch {
        output.exitWithError(gpa, mode, .{
            .code = 110,
            .err_type = "internal_error",
            .message = "Failed to write PID file",
            .recoverable = true,
        });
    };

    if (mode == .human) {
        var buf: [128]u8 = undefined;
        const msg = std.fmt.bufPrint(&buf, "  Daemon started (PID: {d})\n", .{pid}) catch "";
        output.writeRaw(msg);
        return;
    }

    var out: std.Io.Writer.Allocating = .init(gpa);
    defer out.deinit();
    var jw: std.json.Stringify = .{ .writer = &out.writer };
    jw.beginObject() catch return;
    jw.objectField("ok") catch return;
    jw.write(true) catch return;
    jw.objectField("pid") catch return;
    jw.write(pid) catch return;
    jw.endObject() catch return;
    output.writeRaw(out.written());
    output.writeRaw("\n");
}

fn daemonStop(io: std.Io, gpa: std.mem.Allocator, mode: output.Mode, home: []const u8) !void {
    const pid_path = try pidFilePath(gpa, home);
    defer gpa.free(pid_path);

    const pid = readPidFile(io, pid_path) orelse {
        output.exitWithError(gpa, mode, .{
            .code = 92,
            .err_type = "resource_not_found",
            .message = "No daemon running (PID file not found)",
            .recoverable = false,
        });
    };

    // Remove PID file
    std.Io.Dir.cwd().deleteFile(io, pid_path) catch {};

    if (mode == .human) {
        var buf: [128]u8 = undefined;
        const msg = std.fmt.bufPrint(&buf, "  Daemon stopped (PID: {d})\n", .{pid}) catch "";
        output.writeRaw(msg);
        return;
    }

    var out: std.Io.Writer.Allocating = .init(gpa);
    defer out.deinit();
    var jw: std.json.Stringify = .{ .writer = &out.writer };
    jw.beginObject() catch return;
    jw.objectField("ok") catch return;
    jw.write(true) catch return;
    jw.objectField("stopped_pid") catch return;
    jw.write(pid) catch return;
    jw.endObject() catch return;
    output.writeRaw(out.written());
    output.writeRaw("\n");
}

fn daemonStatus(io: std.Io, gpa: std.mem.Allocator, mode: output.Mode, home: []const u8) !void {
    const pid_path = try pidFilePath(gpa, home);
    defer gpa.free(pid_path);

    const pid = readPidFile(io, pid_path);
    const running = if (pid) |p| isProcessAlive(p) else false;

    if (mode == .human) {
        if (running and pid != null) {
            var buf: [128]u8 = undefined;
            const msg = std.fmt.bufPrint(&buf, "  Daemon: running (PID: {d})\n", .{pid.?}) catch "";
            output.writeRaw(msg);
        } else {
            output.writeLine("  Daemon: not running");
        }
        return;
    }

    var out: std.Io.Writer.Allocating = .init(gpa);
    defer out.deinit();
    var jw: std.json.Stringify = .{ .writer = &out.writer };
    jw.beginObject() catch return;
    jw.objectField("running") catch return;
    jw.write(running) catch return;
    if (pid) |p| {
        jw.objectField("pid") catch return;
        jw.write(p) catch return;
    }
    jw.endObject() catch return;
    output.writeRaw(out.written());
    output.writeRaw("\n");
}

fn readPidFile(io: std.Io, path: []const u8) ?i32 {
    const content = std.Io.Dir.cwd().readFileAlloc(io, path, std.heap.page_allocator, .unlimited) catch return null;
    defer std.heap.page_allocator.free(content);
    const trimmed = std.mem.trim(u8, content, " \n\r\t");
    return std.fmt.parseInt(i32, trimmed, 10) catch null;
}

fn isProcessAlive(pid: i32) bool {
    // kill(pid, 0) returns 0 if process exists, -1 otherwise
    const ret = std.os.linux.syscall1(.kill, @intCast(pid));
    return ret == 0;
}
