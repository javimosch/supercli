// guide.zig — `guide` command per cli-guide-spec.
// Embeds the full agent mental model as JSON (default) or --human (markdown).
const std = @import("std");
const output = @import("../output.zig");

const VERSION = "0.1.1";

pub fn handleGuide(gpa: std.mem.Allocator, mode: output.Mode) void {
    if (mode == .human) {
        handleGuideHuman();
    } else {
        handleGuideJson(gpa);
    }
}

fn handleGuideJson(gpa: std.mem.Allocator) void {
    var out: std.Io.Writer.Allocating = .init(gpa);
    defer out.deinit();
    var jw: std.json.Stringify = .{ .writer = &out.writer };
    jw.beginObject() catch return;

    jw.objectField("version") catch return;
    jw.write(VERSION) catch return;

    jw.objectField("one_liner") catch return;
    jw.write("Single-binary capability router: discover, inspect, and execute CLI plugin commands behind namespace.resource.action") catch return;

    jw.objectField("model") catch return;
    jw.write("SuperCLI is a deterministic router, not an LLM. It wraps external CLIs behind a uniform namespace.resource.action interface. Plugins declare their commands in plugin.json manifests; sc-zig reads ~/.supercli/plugins/plugins.lock.json to discover and dispatch them. No inference, no guessing — the agent discovers commands, inspects their schema, then executes them. Three implementations exist (sc-zig, sc Node.js, sc-machin) sharing the same lockfile and JSON envelope shapes.") catch return;

    jw.objectField("loop") catch return;
    jw.beginArray() catch return;
    jw.write("sc-zig plugins explore --name <topic>  # find plugins by keyword") catch return;
    jw.write("sc-zig plugins install <name>           # install plugin (needs Node.js sc)") catch return;
    jw.write("sc-zig commands --query <keyword>       # list matching commands") catch return;
    jw.write("sc-zig inspect <ns> <res> <act>         # inspect command schema") catch return;
    jw.write("sc-zig <ns> <res> <act> --flag val      # execute command") catch return;
    jw.endArray() catch return;

    jw.objectField("concepts") catch return;
    jw.beginObject() catch return;

    jw.objectField("plugin") catch return;
    jw.write("A directory under plugins/ with plugin.json (manifest + commands) and meta.json (description + tags). Each command has namespace, resource, action, adapter, adapterConfig, and args.") catch return;

    jw.objectField("lockfile") catch return;
    jw.write("~/.supercli/plugins/plugins.lock.json — the installed-plugin registry. sc-zig reads this to discover commands. Plugin install delegates to Node.js sc.") catch return;

    jw.objectField("adapter") catch return;
    jw.write("The execution backend for a command. 'process' runs an external binary with baseArgs + user flags. The adapter config includes the binary name, base args, and missingDependencyHelp.") catch return;

    jw.objectField("namespace_browse") catch return;
    jw.write("sc-zig <ns> with no resource/action lists all commands in that namespace. sc-zig <ns> <res> lists actions under that resource.") catch return;

    jw.objectField("passthrough") catch return;
    jw.write("A plugin can declare a passthrough command (resource='_', action='_') that forwards all args to the underlying binary verbatim.") catch return;

    jw.endObject() catch return;

    jw.objectField("commands") catch return;
    jw.beginObject() catch return;

    jw.objectField("help-json") catch return;
    jw.write("Print the machine-readable command catalog with exit codes") catch return;

    jw.objectField("guide") catch return;
    jw.write("Print this agent guide (JSON by default, --human for markdown)") catch return;

    jw.objectField("version") catch return;
    jw.write("Print version info as JSON") catch return;

    jw.objectField("commands") catch return;
    jw.write("List all available commands, optionally filtered by --query") catch return;

    jw.objectField("inspect") catch return;
    jw.write("Show the schema for a specific namespace.resource.action command") catch return;

    jw.objectField("plugins") catch return;
    jw.write("Subcommands: list, explore, install, remove, show, learn, doctor, update") catch return;

    jw.objectField("discover") catch return;
    jw.write("Find plugins for a task via --intent") catch return;

    jw.objectField("daemon") catch return;
    jw.write("Subcommands: start, stop, status (PID-file management)") catch return;

    jw.endObject() catch return;

    jw.objectField("examples") catch return;
    jw.beginArray() catch return;
    jw.write("sc-zig plugins explore --name memory  # find memory-related plugins") catch return;
    jw.write("sc-zig plugins install agentmemory-cli  # install a plugin") catch return;
    jw.write("sc-zig commands --query json  # list commands matching 'json'") catch return;
    jw.write("sc-zig inspect rtk git status  # inspect the rtk.git.status command schema") catch return;
    jw.write("sc-zig rtk git status  # execute the command") catch return;
    jw.endArray() catch return;

    jw.objectField("gotchas") catch return;
    jw.beginArray() catch return;
    jw.write("Plugin install delegates to Node.js sc — sc-zig cannot install plugins without Node.js on PATH") catch return;
    jw.write("The lockfile is at ~/.supercli/plugins/plugins.lock.json, not in the sc-zig binary directory") catch return;
    jw.write("Flags use --flag value (space-separated), not --flag=value") catch return;
    jw.write("Positional args are marked in inspect output with positional:true — pass them as bare values before named flags") catch return;
    jw.write("If sc-zig crashes or is missing a feature, fall back to sc (Node.js) — the reference implementation") catch return;
    jw.endArray() catch return;

    jw.endObject() catch return;
    output.writeRaw(out.written());
    output.writeRaw("\n");
}

fn handleGuideHuman() void {
    output.writeLine("# sc-zig — agent guide");
    output.writeLine("");
    output.writeLine("Single-binary capability router: discover, inspect, and execute CLI plugin");
    output.writeLine("commands behind namespace.resource.action");
    output.writeLine("");
    output.writeLine("## Model");
    output.writeLine("");
    output.writeLine("SuperCLI is a deterministic router, not an LLM. It wraps external CLIs behind");
    output.writeLine("a uniform namespace.resource.action interface. Plugins declare their commands");
    output.writeLine("in plugin.json manifests; sc-zig reads ~/.supercli/plugins/plugins.lock.json");
    output.writeLine("to discover and dispatch them. No inference, no guessing — the agent discovers");
    output.writeLine("commands, inspects their schema, then executes them.");
    output.writeLine("");
    output.writeLine("## Loop");
    output.writeLine("");
    output.writeLine("  sc-zig plugins explore --name <topic>  # find plugins by keyword");
    output.writeLine("  sc-zig plugins install <name>           # install plugin (needs Node.js sc)");
    output.writeLine("  sc-zig commands --query <keyword>       # list matching commands");
    output.writeLine("  sc-zig inspect <ns> <res> <act>         # inspect command schema");
    output.writeLine("  sc-zig <ns> <res> <act> --flag val      # execute command");
    output.writeLine("");
    output.writeLine("## Commands");
    output.writeLine("");
    output.writeLine("  help-json    Print the machine-readable command catalog");
    output.writeLine("  guide        Print this guide (JSON by default, --human for markdown)");
    output.writeLine("  version      Print version info");
    output.writeLine("  commands     List all available commands (--query to filter)");
    output.writeLine("  inspect      Show schema for a specific command");
    output.writeLine("  plugins      list|explore|install|remove|show|learn|doctor|update");
    output.writeLine("  discover     Find plugins for a task (--intent)");
    output.writeLine("  daemon       start|stop|status");
    output.writeLine("");
    output.writeLine("## Gotchas");
    output.writeLine("");
    output.writeLine("- Plugin install delegates to Node.js sc — sc-zig cannot install without Node.js");
    output.writeLine("- Flags use --flag value (space-separated), not --flag=value");
    output.writeLine("- If sc-zig crashes, fall back to sc (Node.js) — the reference implementation");
    output.writeLine("");
}
