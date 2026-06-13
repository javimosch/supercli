"use strict";

const { spawnSync } = require("child_process");
const {
  shouldUseStdioJsonRpc,
  stdioListToolsJsonRpc,
} = require("./mcp-stdio-jsonrpc");

function interpolateEnvPlaceholders(text) {
  if (typeof text !== "string") return text;
  return text.replace(/\$\{([A-Z0-9_]+)\}/g, (_, name) => process.env[name] || "");
}

function interpolateStringArray(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v) => typeof v === "string")
    .map((v) => interpolateEnvPlaceholders(v));
}

function interpolateStringMap(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const out = {};
  for (const [k, v] of Object.entries(value)) {
    if (typeof k === "string" && typeof v === "string") out[k] = interpolateEnvPlaceholders(v);
  }
  return out;
}

function commandBinary(command) {
  const text = String(command || "").trim();
  if (!text) return "";
  const first = text.split(/\s+/)[0];
  return first || "";
}

function checkCommandAvailable(command) {
  const bin = commandBinary(command);
  if (!bin) {
    return { ok: false, message: "Missing command" };
  }
  const probe = spawnSync("sh", ["-lc", `command -v ${bin}`], {
    encoding: "utf-8",
    timeout: 5000,
  });
  if (probe.error || probe.status !== 0) {
    return { ok: false, message: `Command '${bin}' not found in PATH` };
  }
  return { ok: true, message: `Command '${bin}' is available` };
}

async function diagnoseMcpServer(server, options = {}) {
  const discoverTools = options.discoverTools;
  const transport = server.command ? "stdio" : server.url ? "http" : "unknown";
  const checks = [];
  const issues = [];

  checks.push({
    id: "source",
    ok: !!(server.url || server.command),
    message: server.url || server.command
      ? "Server has a callable source"
      : "Server is missing both url and command",
  });

  if (server.command) {
    const c = checkCommandAvailable(server.command);
    checks.push({ id: "command", ok: c.ok, message: c.message });
    if (!c.ok) issues.push(c.message);

    const args = interpolateStringArray(
      Array.isArray(server.args)
        ? server.args
        : Array.isArray(server.commandArgs)
          ? server.commandArgs
          : [],
    );
    const usesNpx = commandBinary(server.command) === "npx";
    const usesMcpRemote = args.includes("mcp-remote");
    const hasYesFlag = args.includes("-y") || args.includes("--yes");
    if (usesNpx && usesMcpRemote && !hasYesFlag) {
      const note = "npx mcp-remote may hang in non-interactive mode without -y/--yes";
      checks.push({ id: "npx_yes_flag", ok: false, message: note });
      issues.push(`${note}; add '-y' before 'mcp-remote' in args.`);
    }
  }

  let tools = [];
  const detail = [];

  if (server.command && shouldUseStdioJsonRpc(server)) {
    try {
      const rpc = await stdioListToolsJsonRpc({
        command: server.command,
        args: interpolateStringArray(
          Array.isArray(server.args)
            ? server.args
            : Array.isArray(server.commandArgs)
              ? server.commandArgs
              : [],
        ),
        env: interpolateStringMap(server.env),
        timeoutMs:
          Number(server.timeout_ms) > 0
            ? Math.min(Number(server.timeout_ms), 15000)
            : 15000,
      });
      tools = Array.isArray(rpc && rpc.tools) ? rpc.tools : [];
      detail.push("JSON-RPC stdio handshake completed");
    } catch (err) {
      const msg = `JSON-RPC discovery failed: ${err.message}`;
      issues.push(msg);
      detail.push(msg);
    }
  }

  if (typeof discoverTools === "function" && (server.url || server.command)) {
    try {
      if (tools.length === 0) tools = await discoverTools(server);
    } catch (err) {
      issues.push(`Tool discovery error: ${err.message}`);
    }
  }

  checks.push({
    id: "tools",
    ok: tools.length > 0,
    message:
      tools.length > 0
        ? `Discovered ${tools.length} tool(s)`
        : "No tools discovered (tool listing may be unsupported or requires auth)",
  });
  if (tools.length === 0) {
    issues.push("No tools discovered; verify auth, endpoint, and list-tools support.");
  }

  const status = checks.every((c) => c.ok)
    ? "healthy"
    : checks.some((c) => c.ok)
      ? "degraded"
      : "unhealthy";

  return {
    server: server.name,
    status,
    transport,
    checks,
    tools,
    issues,
    detail,
  };
}

module.exports = { diagnoseMcpServer, checkCommandAvailable, commandBinary };
