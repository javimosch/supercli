#!/usr/bin/env node

require("dotenv").config({ quiet: true });
const {
  loadConfig,
  syncConfig,
  showConfig,
  setMcpServer,
  removeMcpServer,
  listMcpServers,
  upsertCommand,
} = require("./config");
const { execute } = require("./executor");
const { buildCapabilities } = require("./help-json");
const { handleMcpRegistryCommand } = require("./mcp-local");
const { handlePluginsCommand } = require("./plugins-command");
const {
  buildLocalPlan,
  annotateServerPlan,
  outputHumanPlan,
} = require("./plan-runtime");
const { handleAskCommand } = require("./ask");
const { handleSkillsCommand } = require("./skills");
const { findNamespacePassthrough } = require("./namespace-passthrough");
const { discoverPluginsByIntent } = require("./discover");

const SERVER = process.env.SUPERCLI_SERVER;
const hasServer = !!SERVER;
const isTTY = process.stdout.isTTY;
const rawArgs = process.argv.slice(2);

const flags = {};
const positional = [];
for (let i = 0; i < rawArgs.length; i++) {
  if (rawArgs[i].startsWith("--")) {
    const key = rawArgs[i].slice(2);
    if (i + 1 < rawArgs.length && !rawArgs[i + 1].startsWith("--")) {
      flags[key] = rawArgs[++i];
    } else {
      flags[key] = true;
    }
  } else {
    positional.push(rawArgs[i]);
  }
}

const humanMode =
  flags.human ||
  (isTTY &&
    !flags.json &&
    !flags.compact &&
    !flags.schema &&
    !flags["help-json"]);
const compactMode = !!flags.compact;
const RESERVED_FLAGS = [
  "human",
  "json",
  "compact",
  "schema",
  "help-json",
  "no-color",
  "show-dag",
  "format",
  "on-conflict",
];

function compactKeys(obj) {
  if (Array.isArray(obj)) return obj.map(compactKeys);
  if (obj && typeof obj === "object") {
    const map = {
      version: "v",
      command: "c",
      duration_ms: "ms",
      data: "d",
      namespace: "ns",
      resource: "r",
      action: "a",
      description: "desc",
      adapter: "ad",
      commands: "cmds",
      error: "err",
      message: "msg",
      suggestions: "sug",
    };
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      out[map[k] || k] = compactKeys(v);
    }
    return out;
  }
  return obj;
}

function output(data) {
  const str = compactMode
    ? JSON.stringify(compactKeys(data))
    : humanMode
      ? typeof data === "string"
        ? data
        : JSON.stringify(data, null, 2)
      : JSON.stringify(data);
  console.log(str);
}

function makeStreamEmitter(commandName) {
  if (humanMode) return null
  return (event) => {
    output({
      version: "1.0",
      command: commandName,
      stream: true,
      data: event,
    })
  }
}

function outputHumanTable(rows, columns) {
  if (!humanMode) return false;
  if (!rows || rows.length === 0) {
    console.log("  (empty)");
    return true;
  }
  // Calculate column widths
  const widths = columns.map((col) =>
    Math.max(
      col.label.length,
      ...rows.map((r) => String(r[col.key] || "").length),
    ),
  );
  const header = columns
    .map((col, i) => col.label.padEnd(widths[i]))
    .join("  ");
  const sep = columns.map((_, i) => "─".repeat(widths[i])).join("──");
  console.log(`  ${header}`);
  console.log(`  ${sep}`);
  rows.forEach((row) => {
    const line = columns
      .map((col, i) => String(row[col.key] || "").padEnd(widths[i]))
      .join("  ");
    console.log(`  ${line}`);
  });
  return true;
}

function outputError(error) {
  const numericCode = Number.isInteger(error.code)
    ? error.code
    : Number.parseInt(error.code, 10) || 110;
  const envelope = {
    error: {
      code: numericCode,
      type: error.type || "internal_error",
      message: error.message,
      recoverable: error.recoverable || false,
      suggestions: error.suggestions || [],
    },
  };
  if (humanMode) {
    process.stderr.write(`${envelope.error.type}: ${envelope.error.message}\n`);
    if (envelope.error.suggestions.length) {
      envelope.error.suggestions.forEach((s) =>
        process.stderr.write(`  → ${s}\n`),
      );
    }
  } else {
    console.log(JSON.stringify(compactMode ? compactKeys(envelope) : envelope));
  }
  process.exit(envelope.error.code);
}

function requireServer(message) {
  if (hasServer) return true;
  outputError({
    code: 85,
    type: "invalid_argument",
    message:
      message ||
      "This command requires SUPERCLI_SERVER. Export SUPERCLI_SERVER and run: supercli sync",
    recoverable: false,
  });
  return false;
}

function userFlags() {
  const f = {};
  for (const [k, v] of Object.entries(flags)) {
    if (!RESERVED_FLAGS.includes(k)) f[k] = v;
  }
  return f;
}

function renderTopLevelHelp(config) {
  const namespaces = [...new Set(config.commands.map((c) => c.namespace))];
  if (humanMode) {
    console.log("\n  ⚡ SuperCLI\n");
    console.log("  Namespaces:\n");
    namespaces.forEach((ns) => {
      const resources = [
        ...new Set(
          config.commands.filter((c) => c.namespace === ns).map((c) => c.resource),
        ),
      ];
      console.log(`    ${ns}`);
      resources.forEach((r) => {
        const actions = config.commands
          .filter((c) => c.namespace === ns && c.resource === r)
          .map((c) => c.action);
        console.log(`      └─ ${r}: ${actions.join(", ")}`);
      });
    });
    console.log("\n  Usage: supercli <namespace> <resource> <action> [--args]");
    if (hasServer) console.log("  Sync: supercli sync");
    console.log(
      "  Plugins: supercli plugins explore | supercli plugins learn <name> | supercli plugins install <name|path> | supercli plugins install --git <repo>",
    );
    console.log(
      '  Discover: supercli discover --intent "<task>" [--limit <n>] [--json]',
    );
    console.log(
      "  MCP: supercli mcp list | supercli mcp add <name> --url <url> | supercli mcp tools --mcp-server <name> | supercli mcp call --mcp-server <name> --tool <tool> | supercli mcp bind --mcp-server <name> --tool <tool> --as <ns.res.act> | supercli mcp doctor --mcp-server <name> | supercli mcp remove <name>",
    );
    console.log(
      "  Skills: supercli skills list | supercli skills get <id> | supercli skills search --query <q> | supercli skills sync",
    );
    if (config.features?.ask || process.env.OPENAI_BASE_URL) {
      console.log('  AI: supercli ask "<your natural language query>"');
    }
    console.log("  Server: supercli --server");
    console.log(
      "  Flags: --json | --human | --compact | --schema | --help-json | --server\n",
    );
    return;
  }

  output({
    version: "1.0",
    namespaces: namespaces.map((ns) => ({
      name: ns,
      resources: [...new Set(config.commands.filter((c) => c.namespace === ns).map((c) => c.resource))]
        .map((r) => ({
          name: r,
          actions: config.commands.filter((c) => c.namespace === ns && c.resource === r).map((c) => c.action),
        })),
    })),
  });
}

async function readStdin() {
  // Only read stdin if data is actually being piped
  if (process.stdin.isTTY) return null;
  return new Promise((resolve) => {
    let data = "";
    let resolved = false;
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (chunk) => {
      data += chunk;
    });
    process.stdin.on("end", () => {
      if (resolved) return;
      resolved = true;
      if (!data.trim()) return resolve(null);
      try {
        resolve(JSON.parse(data));
      } catch {
        resolve({ _stdin: data.trim() });
      }
    });
    process.stdin.on("error", () => {
      if (!resolved) {
        resolved = true;
        resolve(null);
      }
    });
    // Short timeout — if no data arrives, stdin is not being piped
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        process.stdin.destroy();
        resolve(null);
      }
    }, 50);
  });
}

async function main() {
  try {
    if (flags.server) {
      require("../server/app.js");
      return;
    }

    // Read stdin if piped
    const stdinData = await readStdin();
    if (stdinData) {
      for (const [k, v] of Object.entries(stdinData)) {
        if (!flags[k] && k !== "_stdin") flags[k] = v;
      }
    }

    if (flags["help-json"]) {
      const config = await loadConfig(SERVER);
      output(buildCapabilities(config, hasServer));
      return;
    }

    if (positional.length === 0) {
      if (!humanMode) {
        output({
          version: "1.0",
          mode: "agent_bootstrap",
          name: "supercli",
          what_is_supercli:
            "Deterministic command router for namespace.resource.action commands, plugin capabilities, MCP tool bindings, and skills.",
          core_capabilities: ["commands", "plugins", "mcp", "skills"],
          first_steps: [
            "supercli --help-json",
            "supercli discover --intent \"<task>\" --json",
            "supercli plugins learn <name> --json",
            "supercli plugins install <name>",
            "supercli commands --query <keyword> --limit 50 --json",
            "supercli inspect <namespace> <resource> <action> --json"
          ],
          intent_workflow:
            "If task command is unknown, use discover -> plugins learn -> plugins install -> commands/inspect -> execute.",
          examples: {
            send_email: [
              'supercli discover --intent "send email" --json',
              "supercli plugins learn resend --json",
              "supercli plugins install resend",
              "supercli commands --namespace resend --json"
            ]
          },
          no_llm_discovery: true,
          note: "Intent discovery is deterministic and does not call an LLM."
        });
        return;
      }
      const config = await loadConfig(SERVER);
      renderTopLevelHelp(config);
      return;
    }

    if (positional[0] === "help") {
      const config = await loadConfig(SERVER);
      renderTopLevelHelp(config);
      return;
    }

    if (positional[0] === "config") {
      if (positional[1] === "show") {
        const info = await showConfig();
        output(info);
        return;
      }
      outputError({
        code: 85,
        type: "invalid_argument",
        message: "Unknown config subcommand. Use: show",
        recoverable: false,
      });
      return;
    }

    if (positional[0] === "ask") {
      const config = await loadConfig(SERVER);
      await handleAskCommand({
        positional,
        config,
        flags,
        context: { server: SERVER || "", config },
        humanMode,
        output,
        outputError,
      });
      return;
    }

    if (hasServer && positional[0] === "sync") {
      await syncConfig(SERVER);
      output({ ok: true, message: "Config synced" });
      return;
    }

    if (positional[0] === "mcp") {
      await handleMcpRegistryCommand({
        positional,
        flags,
        humanMode,
        output,
        outputHumanTable,
        outputError,
        setMcpServer,
        removeMcpServer,
        listMcpServers,
        loadConfig,
        executeCommand: execute,
        upsertCommand,
        serverUrl: SERVER || "",
      });
      return;
    }

    if (positional[0] === "plugins") {
      await handlePluginsCommand({
        positional,
        flags,
        humanMode,
        output,
        outputHumanTable,
        outputError,
      });
      return;
    }

    if (positional[0] === "discover") {
      const intent = flags.intent ? String(flags.intent) : ""
      const result = discoverPluginsByIntent(intent, { limit: flags.limit })
      output(result)
      return;
    }

    if (positional[0] === "skills") {
      const config = await loadConfig(SERVER);
      handleSkillsCommand({
        positional,
        flags,
        config,
        humanMode,
        output,
        outputHumanTable,
        outputError,
      });
      return;
    }

    if (positional[0] === "commands") {
      const config = await loadConfig(SERVER);
      const namespaceFilter = flags.namespace ? String(flags.namespace).toLowerCase().trim() : ""
      const resourceFilter = flags.resource ? String(flags.resource).toLowerCase().trim() : ""
      const actionFilter = flags.action ? String(flags.action).toLowerCase().trim() : ""
      const queryFilter = flags.query ? String(flags.query).toLowerCase().trim() : ""
      const limit = flags.limit === undefined ? null : Number(flags.limit)
      if (flags.limit !== undefined && (!Number.isFinite(limit) || limit <= 0 || !Number.isInteger(limit))) {
        outputError({
          code: 85,
          type: "invalid_argument",
          message: "Invalid --limit. Use a positive integer",
          recoverable: false,
        });
        return;
      }

      let rows = config.commands.map((c) => ({
        command: `${c.namespace} ${c.resource} ${c.action}`,
        namespace: c.namespace,
        resource: c.resource,
        action: c.action,
        description: c.description || "",
        adapter: c.adapter,
        args: (c.args || [])
          .map((a) => `--${a.name}${a.required ? "*" : ""}`)
          .join(" "),
      }));

      rows = rows.filter((row) => {
        if (namespaceFilter && row.namespace.toLowerCase() !== namespaceFilter) return false
        if (resourceFilter && row.resource.toLowerCase() !== resourceFilter) return false
        if (actionFilter && row.action.toLowerCase() !== actionFilter) return false
        if (queryFilter) {
          const haystack = `${row.command} ${row.description} ${row.adapter} ${row.args}`.toLowerCase()
          if (!haystack.includes(queryFilter)) return false
        }
        return true
      })

      const total = rows.length
      if (limit !== null) rows = rows.slice(0, limit)

      if (humanMode) {
        console.log("\n  ⚡ Commands\n");
        outputHumanTable(rows, [
          { key: "command", label: "Command" },
          { key: "adapter", label: "Adapter" },
          { key: "args", label: "Args" },
          { key: "description", label: "Description" },
        ]);
        console.log(`  Returned: ${rows.length}/${total}`)
        console.log("");
      } else {
        output({
          version: "1.0",
          total,
          returned: rows.length,
          filters: {
            namespace: namespaceFilter || null,
            resource: resourceFilter || null,
            action: actionFilter || null,
            query: queryFilter || null,
            limit: limit === null ? null : limit,
          },
          commands: rows,
        });
      }
      return;
    }

    if (positional[0] === "inspect") {
      if (positional.length < 4) {
        outputError({
          code: 85,
          type: "invalid_argument",
          message: "Usage: supercli inspect <namespace> <resource> <action>",
          recoverable: false,
        });
        return;
      }
      const config = await loadConfig(SERVER);
      const cmd = config.commands.find(
        (c) =>
          c.namespace === positional[1] &&
          c.resource === positional[2] &&
          c.action === positional[3],
      );
      if (!cmd) {
        outputError({
          code: 92,
          type: "resource_not_found",
          message: `Command ${positional[1]}.${positional[2]}.${positional[3]} not found`,
          suggestions: ["Run: supercli commands"],
        });
        return;
      }
      const spec = {
        version: "1.0",
        command: `${cmd.namespace}.${cmd.resource}.${cmd.action}`,
        description: cmd.description,
        adapter: cmd.adapter,
        adapterConfig: cmd.adapterConfig,
        args: cmd.args,
        input_schema: {
          type: "object",
          properties: (cmd.args || []).reduce((acc, a) => {
            acc[a.name] = { type: a.type || "string" };
            return acc;
          }, {}),
          required: (cmd.args || [])
            .filter((a) => a.required)
            .map((a) => a.name),
        },
        side_effects: !!cmd.mutation,
        risk_level: cmd.risk_level || "safe",
      };
      if (humanMode) {
        console.log(`\n  ⚡ ${spec.command}\n`);
        console.log(`  Description: ${spec.description || "(none)"}`);
        console.log(`  Adapter:     ${spec.adapter}`);
        console.log(`  Risk:        ${spec.risk_level}`);
        console.log(`  Side effects: ${spec.side_effects ? "yes" : "no"}`);
        if (cmd.args && cmd.args.length) {
          console.log("\n  Arguments:");
          cmd.args.forEach((a) =>
            console.log(
              `    --${a.name} (${a.type || "string"})${a.required ? " [required]" : ""}`,
            ),
          );
        }
        console.log("");
      } else {
        output(spec);
      }
      return;
    }

    if (positional[0] === "plan") {
      if (positional.length < 4) {
        outputError({
          code: 85,
          type: "invalid_argument",
          message:
            "Usage: supercli plan <namespace> <resource> <action> [--args]",
          recoverable: false,
        });
        return;
      }
      const config = await loadConfig(SERVER);
      const cmd = config.commands.find(
        (c) =>
          c.namespace === positional[1] &&
          c.resource === positional[2] &&
          c.action === positional[3],
      );
      if (!cmd) {
        outputError({
          code: 92,
          type: "resource_not_found",
          message: `Command ${positional[1]}.${positional[2]}.${positional[3]} not found`,
          suggestions: ["Run: supercli commands"],
        });
        return;
      }
      const args = userFlags();
      if (!hasServer) {
        const localPlan = buildLocalPlan(cmd, args);
        if (humanMode) outputHumanPlan(localPlan);
        else output(localPlan);
        return;
      }
      try {
        const r = await fetch(`${SERVER}/api/plans`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            command: `${cmd.namespace}.${cmd.resource}.${cmd.action}`,
            args,
            cmd,
          }),
        });
        const plan = annotateServerPlan(await r.json());
        if (humanMode) outputHumanPlan(plan);
        else output(plan);
      } catch (err) {
        outputError({
          code: 105,
          type: "integration_error",
          message: `Failed to create plan: ${err.message}`,
          recoverable: true,
        });
      }
      return;
    }

    if (positional[0] === "execute" && positional.length === 2) {
      if (
        !requireServer(
          "This command requires SUPERCLI_SERVER and a persisted plan. Local plans from `supercli plan` are preview-only.",
        )
      )
        return;
      const planId = positional[1];
      try {
        const r = await fetch(`${SERVER}/api/plans/${planId}/execute`, {
          method: "POST",
        });
        const result = await r.json();
        output(result);
      } catch (err) {
        outputError({
          code: 105,
          type: "integration_error",
          message: `Failed to execute plan: ${err.message}`,
          recoverable: true,
        });
      }
      return;
    }

    {
      const config = await loadConfig(SERVER);
      const passthrough = findNamespacePassthrough(config, positional, rawArgs);
      if (passthrough) {
        const start = Date.now();
        const result = await execute(
          passthrough.command,
          {
            __rawArgs: passthrough.passthroughArgs,
            __passthroughInteractive: humanMode && isTTY,
          },
          {
            server: SERVER || "",
            config,
            onStreamEvent: passthrough.command.adapterConfig && passthrough.command.adapterConfig.stream === "jsonl"
              ? makeStreamEmitter(`${passthrough.namespace}.passthrough`)
              : null,
          },
        );
        const duration = Date.now() - start;
        const envelope = {
          version: "1.0",
          command: `${passthrough.namespace}.passthrough`,
          duration_ms: duration,
          data: result,
        };

        if (humanMode && result && typeof result === "object" && result.passthrough === true) {
          return;
        }
        if (humanMode && result && typeof result === "object" && typeof result.raw === "string") {
          console.log(result.raw);
        } else {
          output(envelope);
        }
        return;
      }
    }

    if (positional.length === 1) {
      const config = await loadConfig(SERVER);
      const cmds = config.commands.filter((c) => c.namespace === positional[0]);
      const resources = [...new Set(cmds.map((c) => c.resource))];
      if (resources.length === 0) {
        outputError({
          code: 92,
          type: "resource_not_found",
          message: `Namespace '${positional[0]}' not found`,
          suggestions: ["Run: supercli help"],
        });
        return;
      }
      if (humanMode) {
        console.log(`\n  ⚡ ${positional[0]}\n`);
        console.log("  Resources:\n");
        resources.forEach((r) => {
          const actions = cmds
            .filter((c) => c.resource === r)
            .map((c) => c.action);
          console.log(`    ${r}: ${actions.join(", ")}`);
        });
        console.log("");
      } else {
        output({ namespace: positional[0], resources });
      }
      return;
    }

    if (positional.length === 2) {
      const config = await loadConfig(SERVER);
      const actions = config.commands
        .filter(
          (c) => c.namespace === positional[0] && c.resource === positional[1],
        )
        .map((c) => c.action);
      if (actions.length === 0) {
        outputError({
          code: 92,
          type: "resource_not_found",
          message: `Resource '${positional[0]}.${positional[1]}' not found`,
          suggestions: [`Run: supercli ${positional[0]}`],
        });
        return;
      }
      if (humanMode) {
        console.log(`\n  ⚡ ${positional[0]}.${positional[1]}\n`);
        console.log("  Actions:\n");
        actions.forEach((a) => console.log(`    ${a}`));
        console.log("");
      } else {
        output({ namespace: positional[0], resource: positional[1], actions });
      }
      return;
    }

    const [namespace, resource, action] = positional;
    const config = await loadConfig(SERVER);
    const cmd = config.commands.find(
      (c) =>
        c.namespace === namespace &&
        c.resource === resource &&
        c.action === action,
    );
    if (!cmd) {
      outputError({
        code: 92,
        type: "resource_not_found",
        message: `Command ${namespace}.${resource}.${action} not found`,
        suggestions: [
          "Run: supercli commands",
          `Run: supercli ${namespace} ${resource}`,
          `Run: supercli discover --intent "${namespace} ${resource} ${action}" --json`,
          `Run: supercli plugins explore --name ${resource} --json`,
        ],
      });
      return;
    }

    if (flags.schema) {
      output({
        version: "1.0",
        command: `${namespace}.${resource}.${action}`,
        input_schema: {
          type: "object",
          properties: (cmd.args || []).reduce((acc, a) => {
            acc[a.name] = { type: a.type || "string" };
            return acc;
          }, {}),
          required: (cmd.args || [])
            .filter((a) => a.required)
            .map((a) => a.name),
        },
        output_schema: cmd.output || { type: "object" },
      });
      return;
    }

    // Validate required args
    const uFlags = userFlags();
    const missingArgs = (cmd.args || []).filter(
      (a) => a.required && !uFlags[a.name],
    );
    if (missingArgs.length > 0) {
      outputError({
        code: 82,
        type: "validation_error",
        message: `Missing required arguments: ${missingArgs.map((a) => "--" + a.name).join(", ")}`,
        suggestions: [
          `Run: supercli inspect ${namespace} ${resource} ${action}`,
        ],
      });
      return;
    }

    const start = Date.now();
    const result = await execute(cmd, uFlags, {
      server: SERVER || "",
      config,
      onStreamEvent: cmd.adapterConfig && cmd.adapterConfig.stream === "jsonl"
        ? makeStreamEmitter(`${namespace}.${resource}.${action}`)
        : null,
    });
    const duration = Date.now() - start;

    const envelope = {
      version: "1.0",
      command: `${namespace}.${resource}.${action}`,
      duration_ms: duration,
      data: result,
    };

    // Post job record (async, non-blocking)
    if (hasServer) {
      fetch(`${SERVER}/api/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          command: `${namespace}.${resource}.${action}`,
          args: uFlags,
          status: "success",
          duration_ms: duration,
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {}); // silent fail
    }

    if (humanMode) {
      process.stderr.write(
        `  ⚡ ${namespace}.${resource}.${action} (${duration}ms)\n`,
      );
      if (Array.isArray(result)) {
        outputHumanTable(
          result.slice(0, 20),
          Object.keys(result[0] || {})
            .slice(0, 6)
            .map((k) => ({ key: k, label: k })),
        );
        if (result.length > 20)
          console.log(`  ... and ${result.length - 20} more`);
      } else if (typeof result === "object") {
        for (const [k, v] of Object.entries(result)) {
          const val = typeof v === "object" ? JSON.stringify(v) : v;
          console.log(`  ${k}: ${val}`);
        }
      }
      console.log("");
    } else {
      output(envelope);
    }
  } catch (err) {
    outputError({
      code: err.code || 110,
      type: err.type || "internal_error",
      message: err.message,
      recoverable: !!err.recoverable,
      suggestions: err.suggestions || [],
    });
  }
}

main();
