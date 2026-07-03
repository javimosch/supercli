// help.zig — --help / --help-json output
// Mirrors cli/help.js structure adapted for sc-zig.
const std = @import("std");
const output = @import("../output.zig");

pub fn handleHelpJson(gpa: std.mem.Allocator) void {
    var out: std.Io.Writer.Allocating = .init(gpa);
    defer out.deinit();
    var jw: std.json.Stringify = .{ .writer = &out.writer };
    jw.beginObject() catch return;
    jw.objectField("name") catch return;
    jw.write("SuperCLI (Zig)") catch return;
    jw.objectField("description") catch return;
    jw.write("Universal Capability Router for AI Agents") catch return;
    jw.objectField("repository") catch return;
    jw.write("https://github.com/javimosch/supercli") catch return;
    jw.objectField("binary") catch return;
    jw.write("sc-zig") catch return;

    jw.objectField("core_commands") catch return;
    jw.beginArray() catch return;
    jw.write("sc-zig <namespace> <resource> <action>  # Execute capability") catch return;
    jw.write("sc-zig inspect <ns> <res> <act>         # View command details") catch return;
    jw.write("sc-zig commands [--query <q>] [--limit <n>]  # List commands") catch return;
    jw.endArray() catch return;

    jw.objectField("plugin_management") catch return;
    jw.beginArray() catch return;
    jw.write("sc-zig plugins list              # Show installed plugins") catch return;
    jw.write("sc-zig plugins install <name>    # Install a plugin") catch return;
    jw.write("sc-zig plugins remove <name>     # Remove a plugin") catch return;
    jw.write("sc-zig plugins show <name>       # Show plugin details") catch return;
    jw.write("sc-zig plugins learn <name>      # Show plugin learn content") catch return;
    jw.write("sc-zig plugins explore [--name <q>] [--tags <t>]  # Browse registry") catch return;
    jw.write("sc-zig plugins update [--check]   # Update bundled plugins") catch return;
    jw.endArray() catch return;

    jw.objectField("discovery") catch return;
    jw.beginArray() catch return;
    jw.write("sc-zig discover --intent \"<task>\" [--limit <n>]  # Find plugins for a task") catch return;
    jw.endArray() catch return;

    jw.objectField("output_modes") catch return;
    jw.beginArray() catch return;
    jw.write("(default)   JSON output") catch return;
    jw.write("--json      Structured JSON envelope") catch return;
    jw.write("--human     Formatted tables and key-value output") catch return;
    jw.endArray() catch return;

    jw.objectField("exit_codes") catch return;
    jw.beginArray() catch return;
    jw.beginObject() catch return;
    jw.objectField("code") catch return;
    jw.write(0) catch return;
    jw.objectField("description") catch return;
    jw.write("success") catch return;
    jw.endObject() catch return;
    jw.beginObject() catch return;
    jw.objectField("code") catch return;
    jw.write(82) catch return;
    jw.objectField("description") catch return;
    jw.write("validation_error") catch return;
    jw.endObject() catch return;
    jw.beginObject() catch return;
    jw.objectField("code") catch return;
    jw.write(85) catch return;
    jw.objectField("description") catch return;
    jw.write("invalid_argument") catch return;
    jw.endObject() catch return;
    jw.beginObject() catch return;
    jw.objectField("code") catch return;
    jw.write(92) catch return;
    jw.objectField("description") catch return;
    jw.write("resource_not_found") catch return;
    jw.endObject() catch return;
    jw.beginObject() catch return;
    jw.objectField("code") catch return;
    jw.write(105) catch return;
    jw.objectField("description") catch return;
    jw.write("integration_error") catch return;
    jw.endObject() catch return;
    jw.beginObject() catch return;
    jw.objectField("code") catch return;
    jw.write(110) catch return;
    jw.objectField("description") catch return;
    jw.write("internal_error") catch return;
    jw.endObject() catch return;
    jw.endArray() catch return;

    jw.endObject() catch return;
    output.writeRaw(out.written());
    output.writeRaw("\n");
}

pub fn handleHelpHuman() void {
    output.writeLine("");
    output.writeLine("  SuperCLI (Zig) — Universal Capability Router for AI Agents");
    output.writeLine("  Repository: https://github.com/javimosch/supercli");
    output.writeLine("");
    output.writeLine("  CORE COMMANDS:");
    output.writeLine("    sc-zig <namespace> <resource> <action>  # Execute capability");
    output.writeLine("    sc-zig inspect <ns> <res> <act>         # View command details");
    output.writeLine("    sc-zig commands [--query <q>] [--limit <n>]  # List commands");
    output.writeLine("");
    output.writeLine("  PLUGIN MANAGEMENT:");
    output.writeLine("    sc-zig plugins list              # Show installed plugins");
    output.writeLine("    sc-zig plugins install <name>    # Install a plugin");
    output.writeLine("    sc-zig plugins remove <name>     # Remove a plugin");
    output.writeLine("    sc-zig plugins show <name>       # Show plugin details");
    output.writeLine("    sc-zig plugins learn <name>      # Show plugin learn content");
    output.writeLine("    sc-zig plugins explore           # Browse plugin registry");
    output.writeLine("    sc-zig plugins update [--check]   # Update bundled plugins");
    output.writeLine("");
    output.writeLine("  DISCOVERY:");
    output.writeLine("    sc-zig discover --intent \"<task>\"  # Find plugins for a task");
    output.writeLine("");
    output.writeLine("  OUTPUT MODES:");
    output.writeLine("    (default)   JSON output");
    output.writeLine("    --json      Structured JSON envelope");
    output.writeLine("    --human     Formatted tables and key-value output");
    output.writeLine("");
    output.writeLine("  EXIT CODES:");
    output.writeLine("    0   success");
    output.writeLine("    82  validation_error");
    output.writeLine("    85  invalid_argument");
    output.writeLine("    92  resource_not_found");
    output.writeLine("    105 integration_error");
    output.writeLine("    110 internal_error");
    output.writeLine("");
}

pub fn handleHelp(gpa: std.mem.Allocator, mode: output.Mode) void {
    if (mode == .human) {
        handleHelpHuman();
    } else {
        handleHelpJson(gpa);
    }
}
