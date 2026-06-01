// bootstrap.zig — handleBootstrap, handleVersionInfo, handleInstallAsSc
const std = @import("std");
const output = @import("../output.zig");

const VERSION = "0.1.0";

pub fn handleBootstrap(gpa: std.mem.Allocator, mode: output.Mode) void {
    if (mode == .human) {
        output.writeLine("\n  SuperCLI (Zig) v0.1.0\n");
        output.writeLine("  Fast single-binary implementation of the SuperCLI core.");
        output.writeLine("  Reads ~/.supercli/plugins/plugins.lock.json\n");
        output.writeLine("  Usage: sc-zig <namespace> <resource> <action> [--flags]");
        output.writeLine("  Flags:  --json | --human");
        output.writeLine("  Cmds:   commands | inspect | plugins list|explore|install|update\n");
        output.writeLine("  Quick start:");
        output.writeLine("    sc-zig plugins explore --name memory   # find memory plugins");
        output.writeLine("    sc-zig plugins install agentmemory-cli # install via Node.js sc");
        output.writeLine("    sc-zig commands --query memory         # list commands");
        output.writeLine("    sc-zig inspect <ns> <res> <act>        # inspect a command\n");
        return;
    }
    var out: std.Io.Writer.Allocating = .init(gpa);
    defer out.deinit();
    var jw: std.json.Stringify = .{ .writer = &out.writer };
    jw.beginObject() catch return;
    jw.objectField("version") catch return;
    jw.write("1.0") catch return;
    jw.objectField("mode") catch return;
    jw.write("agent_bootstrap") catch return;
    jw.objectField("name") catch return;
    jw.write("supercli-zig") catch return;
    jw.objectField("zig_version") catch return;
    jw.write(VERSION) catch return;
    jw.objectField("what_is_this") catch return;
    jw.write("Fast single-binary SuperCLI. Reads ~/.supercli/plugins/plugins.lock.json. Plugin install delegates to Node.js sc.") catch return;
    jw.objectField("workflow") catch return;
    jw.write("discover -> inspect -> execute") catch return;
    jw.objectField("first_steps") catch return;
    jw.beginArray() catch return;
    jw.write("sc-zig plugins explore --name <topic>  # find plugins by keyword") catch return;
    jw.write("sc-zig plugins install <name>           # install plugin (needs Node.js sc)") catch return;
    jw.write("sc-zig commands --query <keyword>       # list matching commands") catch return;
    jw.write("sc-zig inspect <ns> <res> <act>         # inspect command schema") catch return;
    jw.write("sc-zig <ns> <res> <act> --flag val      # execute command") catch return;
    jw.endArray() catch return;
    jw.objectField("memory_workflow") catch return;
    jw.beginObject() catch return;
    jw.objectField("step1") catch return;
    jw.write("sc-zig plugins explore --name memory") catch return;
    jw.objectField("step2") catch return;
    jw.write("sc-zig plugins install agentmemory-cli") catch return;
    jw.objectField("step3") catch return;
    jw.write("sc-zig agentmemory-cli memory save --text \"my name is Javi\" --project default") catch return;
    jw.objectField("step4") catch return;
    jw.write("sc-zig agentmemory-cli memory search --query Javi") catch return;
    jw.endObject() catch return;
    jw.objectField("feature_notes") catch return;
    jw.beginArray() catch return;
    jw.write("plugins explore: searches ~/.supercli/plugins/bundled/ catalog (~3000 plugins)") catch return;
    jw.write("plugins install: delegates to 'sc plugins install' (Node.js sc required)") catch return;
    jw.write("plugins list: shows installed plugins from plugins.lock.json") catch return;
    jw.write("positional args: schema-defined positional args are passed correctly") catch return;
    jw.write("--key value: flags passed as separate args for broadest binary compat") catch return;
    jw.endArray() catch return;
    jw.endObject() catch return;
    output.writeRaw(out.written());
    output.writeRaw("\n");
}

pub fn handleVersionInfo(gpa: std.mem.Allocator, mode: output.Mode) void {
    if (mode == .human) {
        output.writeLine("SuperCLI (Zig) v0.1.0");
        output.writeLine("Implementation: Zig 0.16.0");
        output.writeLine("Binary: sc-zig");
        return;
    }
    var out: std.Io.Writer.Allocating = .init(gpa);
    defer out.deinit();
    var jw: std.json.Stringify = .{ .writer = &out.writer };
    jw.beginObject() catch return;
    jw.objectField("name") catch return;
    jw.write("SuperCLI") catch return;
    jw.objectField("implementation") catch return;
    jw.write("Zig") catch return;
    jw.objectField("version") catch return;
    jw.write(VERSION) catch return;
    jw.objectField("zig_version") catch return;
    jw.write("0.16.0") catch return;
    jw.objectField("binary_name") catch return;
    jw.write("sc-zig") catch return;
    jw.endObject() catch return;
    output.writeRaw(out.written());
    output.writeRaw("\n");
}

pub fn handleInstallAsSc(io: std.Io, gpa: std.mem.Allocator, mode: output.Mode) void {
    const current_exe = std.process.executablePathAlloc(io, gpa) catch {
        output.exitWithError(gpa, mode, .{
            .code = 101,
            .err_type = "internal_error",
            .message = "Failed to get executable path",
            .recoverable = false,
        });
    };
    defer gpa.free(current_exe);

    if (mode == .human) {
        output.writeLine("  Installing sc-zig as sc...\n");
        output.writeRaw("  Current binary: ");
        output.writeLine(current_exe);
        output.writeLine("  This will replace the Node.js 'sc' command with the Zig version.");
        output.writeLine("  To revert, run: npm uninstall -g supercli && npm install -g supercli\n");
        output.writeLine("  Installation instructions:");
        output.writeLine("    sudo ln -sf ");
        output.writeRaw(current_exe);
        output.writeLine(" /usr/local/bin/sc");
        output.writeLine("");
        output.writeLine("  Or use the curl install script with --replace flag:");
        output.writeLine("    curl -sSL https://github.com/javimosch/supercli/releases/download/v0.1.0-zig/install.sh | bash -s -- --replace");
    } else {
        var out: std.Io.Writer.Allocating = .init(gpa);
        defer out.deinit();
        var jw: std.json.Stringify = .{ .writer = &out.writer };
        jw.beginObject() catch return;
        jw.objectField("action") catch return;
        jw.write("install_as_sc") catch return;
        jw.objectField("current_binary") catch return;
        jw.write(current_exe) catch return;
        jw.objectField("note") catch return;
        jw.write("This replaces Node.js sc with Zig sc-zig. Revert: npm uninstall -g supercli && npm install -g supercli") catch return;
        jw.endObject() catch return;
        output.writeRaw(out.written());
        output.writeRaw("\n");
    }
}
