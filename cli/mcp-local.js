const { discoverMcpTools, normalizeTools } = require("./mcp-discovery");
const { diagnoseMcpServer } = require("./mcp-diagnostics");
const {
  isDaemonRunning,
  startDaemon,
  stopDaemon,
  daemonStatus,
  listDaemonServers,
  stopDaemonServer,
} = require("./mcp-daemon-client");

function parseJsonFlag(name, raw, outputError) {
  if (raw === undefined) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    outputError({
      code: 85,
      type: "invalid_argument",
      message: `Invalid JSON for --${name}`,
      recoverable: false,
    });
    return null;
  }
}

function normalizeTransport(server) {
  if (server && server.command) return "stdio";
  if (server && server.url) return "http";
  return "unknown";
}


function parseAsCommandId(value) {
  const text = String(value || "").trim();
  const parts = text.split(".").filter(Boolean);
  if (parts.length !== 3) return null;
  return { namespace: parts[0], resource: parts[1], action: parts[2], id: parts.join(".") };
}

function buildInputFromFlags(flags) {
  const out = {};
  const skip = new Set([
    "human",
    "json",
    "compact",
    "schema",
    "help-json",
    "show-dag",
    "format",
    "mcp-server",
    "tool",
    "input-json",
    "timeout-ms",
    "as",
    "description",
  ]);
  for (const [k, v] of Object.entries(flags || {})) {
    if (skip.has(k)) continue;
    out[k] = v;
  }
  return out;
}

async function handleMcpRegistryCommand(options) {
  const {
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
    executeCommand,
    upsertCommand,
    serverUrl,
    discoverTools = discoverMcpTools,
    diagnoseServer = diagnoseMcpServer,
  } = options;
  const cliFlags = flags || {};
  const subcommand = positional[1];

  if (subcommand === "list") {
    const servers = await listMcpServers();
    if (humanMode) {
      const rows = servers.map((s) => ({
        name: s.name,
        transport: normalizeTransport(s),
        source: s.url || s.command || "",
      }));
      console.log("\n  ⚡ Local MCP Servers\n");
      outputHumanTable(rows, [
        { key: "name", label: "Name" },
        { key: "transport", label: "Transport" },
        { key: "source", label: "Source" },
      ]);
      console.log("");
    } else {
      output({ mcp_servers: servers });
    }
    return true;
  }

  if (subcommand === "add") {
    const name = positional[2];
    const url = cliFlags.url;
    const command = cliFlags.command;

    if (!name || (!url && !command)) {
      outputError({
        code: 85,
        type: "invalid_argument",
        message:
          "Usage: supercli mcp add <name> (--url <mcp_url> | --command <binary>) [--args-json '[]'] [--headers-json '{}'] [--env-json '{}'] [--timeout-ms <ms>]",
        recoverable: false,
      });
      return true;
    }

    const args = parseJsonFlag("args-json", cliFlags["args-json"], outputError);
    if (args === null) return true;
    const headers = parseJsonFlag(
      "headers-json",
      cliFlags["headers-json"],
      outputError,
    );
    if (headers === null) return true;
    const env = parseJsonFlag("env-json", cliFlags["env-json"], outputError);
    if (env === null) return true;
    const timeoutMs =
      cliFlags["timeout-ms"] !== undefined
        ? Number(cliFlags["timeout-ms"])
        : undefined;
    if (
      cliFlags["timeout-ms"] !== undefined &&
      (!Number.isFinite(timeoutMs) || timeoutMs <= 0)
    ) {
      outputError({
        code: 85,
        type: "invalid_argument",
        message: "--timeout-ms must be a positive number",
        recoverable: false,
      });
      return true;
    }

    const stateful = cliFlags["stateful"] === true || cliFlags["stateful"] === "true";

    await setMcpServer(name, {
      url,
      command,
      args,
      headers,
      env,
      timeout_ms: timeoutMs,
      ...(stateful ? { stateful: true } : {}),
    });
    output({ ok: true, message: `MCP server '${name}' saved locally`, stateful });
    return true;
  }

  if (subcommand === "tools") {
    const serverName = cliFlags["mcp-server"] || positional[2];
    if (!serverName) {
      outputError({
        code: 85,
        type: "invalid_argument",
        message: "Usage: supercli mcp tools --mcp-server <name>",
        recoverable: false,
      });
      return true;
    }
    const servers = await listMcpServers();
    const server = servers.find((s) => s && s.name === serverName);
    if (!server) {
      outputError({
        code: 92,
        type: "resource_not_found",
        message: `MCP server '${serverName}' not found`,
        suggestions: ["Run: supercli mcp list --json"],
      });
      return true;
    }
    const tools = await discoverTools(server);
    if (humanMode) {
      console.log(`\n  ⚡ MCP Tools (${serverName})\n`);
      if (tools.length > 0) {
        outputHumanTable(tools, [
          { key: "name", label: "Name" },
          { key: "description", label: "Description" },
        ]);
      } else {
        console.log("  No tools discovered. You can still call tools manually if you know the tool name.");
        console.log(`  Tip: run supercli mcp doctor --mcp-server ${serverName} --json`);
      }
      console.log("");
    } else {
      output({ server: serverName, tools, discovered: tools.length });
    }
    return true;
  }

  if (subcommand === "call") {
    const serverName = cliFlags["mcp-server"];
    const tool = cliFlags.tool;
    if (!serverName || !tool) {
      outputError({
        code: 85,
        type: "invalid_argument",
        message:
          "Usage: supercli mcp call --mcp-server <name> --tool <tool> [--input-json '{}'] [--timeout-ms <ms>]",
        recoverable: false,
      });
      return true;
    }

    const inputJson = parseJsonFlag("input-json", cliFlags["input-json"], outputError);
    if (inputJson === null) return true;
    const timeoutMs =
      cliFlags["timeout-ms"] !== undefined
        ? Number(cliFlags["timeout-ms"])
        : undefined;
    if (
      cliFlags["timeout-ms"] !== undefined &&
      (!Number.isFinite(timeoutMs) || timeoutMs <= 0 || timeoutMs > 180000)
    ) {
      outputError({
        code: 85,
        type: "invalid_argument",
        message: "--timeout-ms must be a positive number <= 180000",
        recoverable: false,
      });
      return true;
    }
    const input =
      inputJson !== undefined
        ? inputJson && typeof inputJson === "object" && !Array.isArray(inputJson)
          ? inputJson
          : { input: inputJson }
        : buildInputFromFlags(cliFlags);

    const cmd = {
      namespace: "mcp",
      resource: "tool",
      action: "call",
      adapter: "mcp",
      adapterConfig: {
        server: serverName,
        tool,
        timeout_ms: timeoutMs,
      },
      args: [],
    };

    const config = await loadConfig();
    const result = await executeCommand(cmd, input, {
      server: serverUrl || "",
      config,
    });
    output({ ok: true, server: serverName, tool, result });
    return true;
  }

  if (subcommand === "bind") {
    const serverName = cliFlags["mcp-server"];
    const tool = cliFlags.tool;
    const as = parseAsCommandId(cliFlags.as);
    if (!serverName || !tool || !as) {
      outputError({
        code: 85,
        type: "invalid_argument",
        message:
          "Usage: supercli mcp bind --mcp-server <name> --tool <tool> --as <namespace.resource.action> [--description <text>]",
        recoverable: false,
      });
      return true;
    }

    const command = {
      _id: `command:${as.namespace}.${as.resource}.${as.action}`,
      namespace: as.namespace,
      resource: as.resource,
      action: as.action,
      description:
        cliFlags.description ||
        `MCP tool '${tool}' via server '${serverName}'`,
      adapter: "mcp",
      adapterConfig: {
        server: serverName,
        tool,
      },
      args: [],
    };

    const saved = await upsertCommand(command);
    output({ ok: true, command: `${saved.namespace}.${saved.resource}.${saved.action}`, saved });
    return true;
  }

  if (subcommand === "doctor") {
    const serverName = cliFlags["mcp-server"] || positional[2];
    if (!serverName) {
      outputError({
        code: 85,
        type: "invalid_argument",
        message: "Usage: supercli mcp doctor --mcp-server <name>",
        recoverable: false,
      });
      return true;
    }
    const servers = await listMcpServers();
    const server = servers.find((s) => s && s.name === serverName);
    if (!server) {
      outputError({
        code: 92,
        type: "resource_not_found",
        message: `MCP server '${serverName}' not found`,
        suggestions: ["Run: supercli mcp list --json"],
      });
      return true;
    }
    const report = await diagnoseServer(server, { discoverTools });
    if (humanMode) {
      console.log(`\n  ⚡ MCP Doctor (${serverName})\n`);
      console.log(`  Status: ${report.status}`);
      console.log(`  Transport: ${report.transport}\n`);
      outputHumanTable(report.checks, [
        { key: "id", label: "Check" },
        { key: "ok", label: "OK" },
        { key: "message", label: "Message" },
      ]);
      if (report.issues.length > 0) {
        console.log("\n  Issues:");
        for (const issue of report.issues) console.log(`  - ${issue}`);
      }
      console.log("");
    } else {
      output(report);
    }
    return true;
  }

  if (subcommand === "remove") {
    const name = positional[2];
    if (!name) {
      outputError({
        code: 85,
        type: "invalid_argument",
        message: "Usage: supercli mcp remove <name>",
        recoverable: false,
      });
      return true;
    }
    const removed = await removeMcpServer(name);
    output({ ok: true, removed });
    return true;
  }

  if (subcommand === "daemon") {
    const daemonCmd = positional[2];

    if (daemonCmd === "start") {
      const already = await isDaemonRunning();
      if (already) {
        const status = await daemonStatus();
        output({ ok: true, message: "MCP daemon already running", pid: status.pid, servers: status.servers });
        return true;
      }
      const result = await startDaemon();
      output({ ok: true, message: "MCP daemon started", pid: result.pid });
      return true;
    }

    if (daemonCmd === "stop") {
      const result = await stopDaemon();
      if (result && result.ok) {
        output({ ok: true, message: "MCP daemon stopped" });
      } else {
        output({ ok: false, message: "MCP daemon was not running" });
      }
      return true;
    }

    if (daemonCmd === "status") {
      const running = await isDaemonRunning();
      if (!running) {
        if (humanMode) {
          console.log("\n  ⚡ MCP Daemon\n");
          console.log("  Status: not running");
          console.log("  Tip: start with supercli mcp daemon start\n");
        } else {
          output({ running: false });
        }
        return true;
      }
      const status = await daemonStatus();
      let activeServers = [];
      try {
        const serversResult = await listDaemonServers();
        activeServers = serversResult.servers || [];
      } catch {}
      if (humanMode) {
        console.log("\n  ⚡ MCP Daemon\n");
        console.log(`  Status: running (pid ${status.pid})`);
        console.log(`  Active servers: ${activeServers.length}`);
        if (activeServers.length > 0) {
          outputHumanTable(activeServers, [
            { key: "name", label: "Name" },
            { key: "state", label: "State" },
            { key: "pid", label: "PID" },
          ]);
        }
        console.log("");
      } else {
        output({ running: true, pid: status.pid, servers: activeServers });
      }
      return true;
    }

    if (daemonCmd === "restart") {
      await stopDaemon();
      await new Promise((r) => setTimeout(r, 500));
      const result = await startDaemon();
      output({ ok: true, message: "MCP daemon restarted", pid: result.pid });
      return true;
    }

    if (daemonCmd === "stop-server") {
      const serverName = positional[3] || cliFlags["mcp-server"];
      if (!serverName) {
        outputError({
          code: 85,
          type: "invalid_argument",
          message: "Usage: supercli mcp daemon stop-server <server-name>",
          recoverable: false,
        });
        return true;
      }
      const result = await stopDaemonServer(serverName);
      output(result);
      return true;
    }

    outputError({
      code: 85,
      type: "invalid_argument",
      message: "Usage: supercli mcp daemon <start|stop|status|restart|stop-server>",
      recoverable: false,
    });
    return true;
  }

  outputError({
    code: 85,
    type: "invalid_argument",
    message: "Unknown mcp subcommand. Use: list, add, tools, call, bind, doctor, remove, daemon",
    recoverable: false,
  });
  return true;
}

module.exports = { handleMcpRegistryCommand, discoverMcpTools, normalizeTools };
