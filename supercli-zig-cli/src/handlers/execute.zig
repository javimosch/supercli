// execute.zig — handleExecuteCommand
const std = @import("std");
const output = @import("../output.zig");
const config = @import("../config.zig");
const executor = @import("../executor.zig");

const RESERVED_FLAGS = [_][]const u8{ "json", "human", "compact", "schema", "help", "no-color", "format" };

pub fn handleExecuteCommand(
    io: std.Io,
    gpa: std.mem.Allocator,
    mode: output.Mode,
    cmd: config.Command,
    flags: std.StringHashMap([]const u8),
    passthrough_args: [][]const u8,
    is_passthrough: bool,
) !void {
    const start = std.Io.Timestamp.now(io, .real).toMilliseconds();

    if (!std.mem.eql(u8, cmd.adapter, "process")) {
        output.exitWithError(gpa, mode, .{
            .code = 85,
            .err_type = "invalid_argument",
            .message = "Only 'process' adapter is supported in the Zig CLI",
            .recoverable = false,
        });
    }

    const acfg = try executor.parseAdapterConfig(gpa, cmd.adapter_config_raw);

    if (acfg.command.len == 0) {
        output.exitWithError(gpa, mode, .{
            .code = 85,
            .err_type = "invalid_argument",
            .message = "Command has no binary configured (missing adapterConfig.command)",
            .recoverable = false,
        });
    }

    const arg_defs = try executor.parseArgDefs(gpa, cmd.args_raw);

    var skip_keys: std.ArrayList([]const u8) = .empty;
    for (RESERVED_FLAGS) |k| try skip_keys.append(gpa, k);
    try skip_keys.append(gpa, "limit");
    try skip_keys.append(gpa, "query");

    const extra_args = if (is_passthrough or acfg.passthrough)
        passthrough_args
    else
        try executor.buildFlagArgs(gpa, flags, skip_keys.items, arg_defs);

    const exec_result = executor.executeProcess(io, gpa, acfg.command, .{
        .base_args = acfg.base_args,
        .extra_args = extra_args,
        .passthrough = is_passthrough or acfg.passthrough,
        .parse_json = acfg.parse_json,
        .timeout_ms = acfg.timeout_ms,
        .cwd = acfg.cwd,
        .requires_interactive = acfg.requires_interactive,
        .interactive_flags = acfg.interactive_flags,
    }) catch |err| {
        if (err == error.SafetyViolation) {
            output.exitWithError(gpa, mode, .{
                .code = 91,
                .err_type = "safety_violation",
                .message = "Interactive command blocked in non-TTY context",
                .recoverable = false,
            });
        }
        return err;
    };

    const duration = std.Io.Timestamp.now(io, .real).toMilliseconds() - start;

    switch (exec_result) {
        .passthrough => return,
        .err => |e| {
            output.exitWithError(gpa, mode, .{
                .code = e.exit_code,
                .err_type = if (e.exit_code == 124) "timeout_error" else "integration_error",
                .message = e.message,
                .recoverable = true,
            });
        },
        .json => |json_val| {
            var out: std.Io.Writer.Allocating = .init(gpa);
            defer out.deinit();
            if (mode == .human) {
                var jw: std.json.Stringify = .{
                    .writer = &out.writer,
                    .options = .{ .whitespace = .indent_2 },
                };
                jw.write(json_val) catch {};
                output.writeRaw(out.written());
                output.writeRaw("\n");
            } else {
                const cmd_key = try std.fmt.allocPrint(gpa, "{s}.{s}.{s}", .{ cmd.namespace, cmd.resource, cmd.action });
                defer gpa.free(cmd_key);
                var jw: std.json.Stringify = .{ .writer = &out.writer };
                jw.beginObject() catch return;
                jw.objectField("version") catch return;
                jw.write("1.0") catch return;
                jw.objectField("command") catch return;
                jw.write(cmd_key) catch return;
                jw.objectField("duration_ms") catch return;
                jw.write(duration) catch return;
                jw.objectField("data") catch return;
                jw.write(json_val) catch return;
                jw.endObject() catch return;
                output.writeRaw(out.written());
                output.writeRaw("\n");
            }
        },
        .raw => |raw_val| {
            if (mode == .human) {
                output.writeLine(raw_val);
            } else {
                const cmd_key = try std.fmt.allocPrint(gpa, "{s}.{s}.{s}", .{ cmd.namespace, cmd.resource, cmd.action });
                defer gpa.free(cmd_key);
                var out: std.Io.Writer.Allocating = .init(gpa);
                defer out.deinit();
                var jw: std.json.Stringify = .{ .writer = &out.writer };
                jw.beginObject() catch return;
                jw.objectField("version") catch return;
                jw.write("1.0") catch return;
                jw.objectField("command") catch return;
                jw.write(cmd_key) catch return;
                jw.objectField("duration_ms") catch return;
                jw.write(duration) catch return;
                jw.objectField("data") catch return;
                jw.beginObject() catch return;
                jw.objectField("raw") catch return;
                jw.write(raw_val) catch return;
                jw.endObject() catch return;
                jw.endObject() catch return;
                output.writeRaw(out.written());
                output.writeRaw("\n");
            }
        },
    }
}
