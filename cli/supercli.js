#!/usr/bin/env node

require("dotenv").config({ quiet: true });
const { loadConfig, syncConfig, showConfig, setMcpServer, removeMcpServer, listMcpServers, upsertCommand, getClientId } = require("./config");
const { handleMcpRegistryCommand } = require("./mcp-local");
const { handlePluginsCommand } = require("./plugins-command");
const { handleServerCommand } = require("./server-command");
const { handleHarnessOnboard, handleHarnessOffboard } = require("./harness-onboard");
const { handleAskCommand } = require("./ask");
const { handleSkillsCommand } = require("./skills");
const { findNamespacePassthrough } = require("./namespace-passthrough");
const { discoverPluginsByIntent } = require("./discover");
const { startDaemon, stopDaemon, getDaemonStatus, writeLog } = require("./daemon");
const { buildCapabilities } = require("./help-json");

const { CLI_VERSION, parseArgs, userFlags, readStdin } = require("./arg-parser");
const { makeOutput, makeOutputError, outputHumanTable, makeStreamEmitter } = require("./output");
const { displayJsonHelp, displayComprehensiveHelp, renderTopLevelHelp } = require("./help");
const { handleCommandsQuery, handleInspect, handleSchema, handleNamespaceBrowse } = require("./commands-handler");
const { handleExecute, handlePlan, handleExecutePlan } = require("./execute-handler");

const SERVER = process.env.SUPERCLI_SERVER;
const hasServer = !!SERVER;
const { flags, positional, rawArgs } = parseArgs(process.argv.slice(2));
const humanMode = !!flags.human;
const compactMode = !!flags.compact;
const output = makeOutput({ humanMode, compactMode });
const outputError = makeOutputError({ humanMode, compactMode });

function requireServer(message) {
  if (hasServer) return true;
  outputError({ code: 85, type: "invalid_argument", message: message || "This command requires SUPERCLI_SERVER.", recoverable: false });
  return false;
}

async function main() {
  try {
    if (flags.server) { require("../server/app.js"); return; }

    const stdinData = await readStdin();
    if (stdinData) {
      for (const [k, v] of Object.entries(stdinData)) {
        if (!flags[k] && k !== "_stdin") flags[k] = v;
      }
    }

    if (flags.version) {
      if (humanMode) {
        console.log(`SuperCLI v${CLI_VERSION}`);
        console.log("Implementation: JavaScript (Node.js)");
        console.log("Binary: supercli");
      } else {
        output({ name: "SuperCLI", implementation: "JavaScript", version: CLI_VERSION, node_version: process.version, binary_name: "supercli" });
      }
      return;
    }

    // Namespace passthrough check (before --help so e.g. "cline --help" passes through)
    {
      const config = await loadConfig(SERVER);
      const passthrough = findNamespacePassthrough(config, positional, rawArgs);
      if (passthrough) {
        const start = Date.now();
        const { execute } = require("./executor");
        const result = await execute(passthrough.command, { __rawArgs: passthrough.passthroughArgs, __passthroughInteractive: humanMode && process.stdout.isTTY }, {
          server: SERVER || "", config,
          onStreamEvent: passthrough.command.adapterConfig?.stream === "jsonl"
            ? makeStreamEmitter(`${passthrough.namespace}.passthrough`, { humanMode, output }) : null,
        });
        const envelope = { version: "1.0", command: `${passthrough.namespace}.passthrough`, duration_ms: Date.now() - start, data: result };
        if (humanMode && result && typeof result === "object" && result.passthrough === true) return;
        if (humanMode && result && typeof result === "object" && typeof result.raw === "string") { console.log(result.raw); } else { output(envelope); }
        return;
      }
    }

    if (flags.help) {
      if (humanMode || flags.human) displayComprehensiveHelp();
      else output(displayJsonHelp());
      return;
    }

    if (flags["help-json"]) {
      const config = await loadConfig(SERVER);
      output(buildCapabilities(config, hasServer));
      return;
    }

    if (positional.length === 0) {
      if (!humanMode) {
        output({
          version: "1.0", mode: "agent_bootstrap", name: "supercli",
          what_is_supercli: "Capability router that wraps external CLIs behind namespace.resource.action commands. Workflow: discover → learn → inspect → plan → execute.",
          core_capabilities: ["commands", "plugins", "mcp", "skill_docs", "ask"],
          capabilities: {
            discover: { type: "deterministic", description: "Keyword matching against plugin metadata", llm: false },
            ask: { type: "llm_suggestions", description: "Natural language to command suggestions (no execution)", llm: true },
            skills: { type: "documentation", description: "Agent-facing skill documents" },
            plugins: { type: "discovery", description: "Plugin management and discovery" },
            commands: { type: "query", description: "Query available commands" },
            inspect: { type: "introspection", description: "View command schema" },
            plan: { type: "preview", description: "Preview execution steps" },
          },
          first_steps: [
            "supercli --help-json",
            'supercli discover --intent "<task>" --json',
            "supercli plugins explore --name <tool> --json",
            "supercli plugins learn <name> --json",
            "supercli commands --query <keyword> --limit 50 --json",
            "supercli inspect <namespace> <resource> <action> --json",
            "supercli skills sync --json                         # sync & index skill documents",
            "supercli skills list --catalog --limit 10 --json    # browse available skills",
            "supercli skills search --query <topic> --json       # find a skill by topic",
            "supercli skills teach <name>                        # load skill into context",
          ],
          token_optimization: {
            context_mode: "Use supercli MCP context-mode for large command outputs.",
            quick_start: "sc mcp call --mcp-server context-mode --tool ctx_batch_execute --input-json '{\"commands\":[{\"label\":\"Commands\",\"command\":\"supercli commands --json\"}],\"queries\":[\"<terms>\"]}' --json",
          },
        });
        return;
      }
      const config = await loadConfig(SERVER);
      renderTopLevelHelp(config, { humanMode, output, hasServer });
      return;
    }

    if (positional[0] === "help") {
      const config = await loadConfig(SERVER);
      renderTopLevelHelp(config, { humanMode, output, hasServer });
      return;
    }

    if (positional[0] === "config") {
      if (positional[1] === "show") { output(await showConfig()); return; }
      outputError({ code: 85, type: "invalid_argument", message: "Unknown config subcommand. Use: show", recoverable: false });
      return;
    }

    if (positional[0] === "ask") {
      const config = await loadConfig(SERVER);
      await handleAskCommand({ positional, config, flags, context: { server: SERVER || "", config }, humanMode, output, outputError });
      return;
    }

    if (hasServer && positional[0] === "sync") {
      const result = await syncConfig(SERVER);
      output({ ok: true, message: "Config synced", server_plugins: result.server_plugins || null, cli_adapters: result.cli_adapters || null });
      return;
    }

    if (positional[0] === "mcp") {
      await handleMcpRegistryCommand({ positional, flags, humanMode, output, outputHumanTable, outputError, setMcpServer, removeMcpServer, listMcpServers, loadConfig, executeCommand: require("./executor").execute, upsertCommand, serverUrl: SERVER || "" });
      return;
    }
    if (positional[0] === "plugins") { await handlePluginsCommand({ positional, flags, humanMode, output, outputHumanTable, outputError }); return; }
    if (positional[0] === "server")  { await handleServerCommand({ positional, flags, humanMode, output, outputHumanTable, outputError }); return; }
    if (positional[0] === "onboard") { await handleHarnessOnboard({ positional, flags, humanMode, output, outputError }); return; }
    if (positional[0] === "offboard") { await handleHarnessOffboard({ positional, flags, humanMode, output, outputError }); return; }

    if (positional[0] === "discover") {
      output(discoverPluginsByIntent(flags.intent ? String(flags.intent) : "", { limit: flags.limit }));
      return;
    }

    if (positional[0] === "skills") {
      const config = await loadConfig(SERVER);
      handleSkillsCommand({ positional, flags, config, humanMode, output, outputHumanTable, outputError });
      return;
    }

    if (positional[0] === "daemon") {
      const sub = positional[1] || "status";
      if (sub === "start")  { output(startDaemon()); return; }
      if (sub === "stop")   { output(stopDaemon()); return; }
      if (sub === "status") { output(getDaemonStatus()); return; }
      outputError({ code: 85, type: "invalid_argument", message: "Unknown daemon subcommand. Use: start|stop|status", recoverable: false });
      return;
    }

    if (positional[0] === "commands") {
      const config = await loadConfig(SERVER);
      handleCommandsQuery(config, flags, { humanMode, output, outputError, outputHumanTable });
      return;
    }

    if (positional[0] === "inspect") {
      const config = await loadConfig(SERVER);
      handleInspect(config, positional, { humanMode, output, outputError });
      return;
    }

    if (positional[0] === "plan") {
      if (positional.length < 4) {
        outputError({ code: 85, type: "invalid_argument", message: "Usage: supercli plan <namespace> <resource> <action> [--args]", recoverable: false });
        return;
      }
      const config = await loadConfig(SERVER);
      const cmd = config.commands.find((c) => c.namespace === positional[1] && c.resource === positional[2] && c.action === positional[3]);
      if (!cmd) { outputError({ code: 92, type: "resource_not_found", message: `Command ${positional[1]}.${positional[2]}.${positional[3]} not found`, suggestions: ["Run: supercli commands"] }); return; }
      await handlePlan(cmd, userFlags(flags), { SERVER, hasServer, humanMode, output, outputError });
      return;
    }

    if (positional[0] === "execute" && positional.length === 2) {
      if (!requireServer("This command requires SUPERCLI_SERVER and a persisted plan.")) return;
      await handleExecutePlan(positional[1], { SERVER, output, outputError });
      return;
    }

    // Namespace/resource browse (1 or 2 positionals)
    if (positional.length === 1 || positional.length === 2) {
      const config = await loadConfig(SERVER);
      handleNamespaceBrowse(config, positional, { humanMode, output, outputError });
      return;
    }

    // Full ns.res.act execution
    const [namespace, resource, action] = positional;
    const config = await loadConfig(SERVER);
    const cmd = config.commands.find((c) => c.namespace === namespace && c.resource === resource && c.action === action);
    if (!cmd) {
      outputError({ code: 92, type: "resource_not_found", message: `Command ${namespace}.${resource}.${action} not found`,
        suggestions: ["Run: supercli commands", `Run: supercli ${namespace} ${resource}`, `Run: supercli discover --intent "${namespace} ${resource} ${action}" --json`, `Run: supercli plugins explore --name ${resource} --json`] });
      return;
    }

    if (flags.schema) { handleSchema(cmd, positional, { output }); return; }

    const uFlags = userFlags(flags);
    const remainingPositionalArgs = positional.slice(3);
    const positionalArgNames = Array.isArray(cmd.adapterConfig?.positionalArgs) ? cmd.adapterConfig.positionalArgs : [];
    if (cmd.adapterConfig && cmd.adapterConfig.passthrough !== true && remainingPositionalArgs.length > 0) {
      let idx = 0;
      for (const name of positionalArgNames) {
        if (idx >= remainingPositionalArgs.length) break;
        if (uFlags[name] !== undefined) continue;
        uFlags[name] = remainingPositionalArgs[idx++];
      }
      const rest = remainingPositionalArgs.slice(idx);
      if (rest.length > 0) uFlags.__positionalArgs = rest;
    }

    const missingArgs = (cmd.args || []).filter((a) => a.required && !uFlags[a.name]);
    if (missingArgs.length > 0) {
      outputError({ code: 82, type: "validation_error", message: `Missing required arguments: ${missingArgs.map((a) => "--" + a.name).join(", ")}`, suggestions: [`Run: supercli inspect ${namespace} ${resource} ${action}`] });
      return;
    }

    if (cmd.adapterConfig && cmd.adapterConfig.passthrough === true) uFlags.__rawArgs = remainingPositionalArgs;

    await handleExecute(cmd, uFlags, config, {
      SERVER, humanMode, output, outputError, outputHumanTable,
      writeLog, getClientId,
      makeStreamEmitter: (name) => makeStreamEmitter(name, { humanMode, output }),
    });
  } catch (err) {
    outputError({ code: err.code || 110, type: err.type || "internal_error", message: err.message, recoverable: !!err.recoverable, suggestions: err.suggestions || [] });
  }
}

main();
