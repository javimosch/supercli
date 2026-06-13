"use strict";

const { spawn } = require("child_process");
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
    if (typeof k === "string" && typeof v === "string") {
      out[k] = interpolateEnvPlaceholders(v);
    }
  }
  return out;
}

function normalizeTools(payload) {
  const source = payload && typeof payload === "object" ? payload : {};
  const raw =
    (Array.isArray(source.tools) && source.tools) ||
    (source.result && Array.isArray(source.result.tools) && source.result.tools) ||
    (Array.isArray(source.result) && source.result) ||
    (Array.isArray(source.data) && source.data) ||
    (Array.isArray(source) && source) ||
    [];

  const tools = [];
  for (const item of raw) {
    if (typeof item === "string") {
      tools.push({ name: item, description: "" });
      continue;
    }
    if (!item || typeof item !== "object") continue;
    const name =
      (typeof item.name === "string" && item.name) ||
      (typeof item.tool === "string" && item.tool) ||
      (typeof item.id === "string" && item.id) ||
      null;
    if (!name) continue;
    tools.push({
      name,
      description: typeof item.description === "string" ? item.description : "",
      input_schema:
        item.inputSchema && typeof item.inputSchema === "object"
          ? item.inputSchema
          : item.input_schema && typeof item.input_schema === "object"
            ? item.input_schema
            : undefined,
    });
  }

  const dedup = new Map();
  for (const t of tools) dedup.set(t.name, t);
  return [...dedup.values()].sort((a, b) => a.name.localeCompare(b.name));
}

async function tryHttpTools(baseUrl, headers = {}) {
  const root = String(interpolateEnvPlaceholders(baseUrl || "")).replace(/\/+$/, "");
  if (!root) return [];
  const attempts = [
    { method: "GET", url: `${root}/tools` },
    { method: "POST", url: `${root}/tools`, body: {} },
    { method: "POST", url: `${root}/tool`, body: { tool: "tools/list", input: {} } },
    { method: "POST", url: `${root}/tool`, body: { tool: "list_tools", input: {} } },
  ];

  for (const attempt of attempts) {
    try {
      const res = await fetch(attempt.url, {
        method: attempt.method,
        headers: {
          ...(attempt.body ? { "Content-Type": "application/json" } : {}),
          ...headers,
        },
        body: attempt.body ? JSON.stringify(attempt.body) : undefined,
      });
      if (!res.ok) continue;
      const data = await res.json().catch(() => null);
      const tools = normalizeTools(data);
      if (tools.length > 0) return tools;
    } catch {
      // keep probing
    }
  }
  return [];
}

async function callStdioProbe(command, args, payload, timeoutMs, env) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args || [], {
      stdio: ["pipe", "pipe", "pipe"],
      shell: !Array.isArray(args) || args.length === 0,
      env: env && typeof env === "object" ? { ...process.env, ...env } : process.env,
    });

    let stdout = "";
    let stderr = "";
    let finished = false;

    const timer = setTimeout(() => {
      if (finished) return;
      finished = true;
      child.kill("SIGKILL");
      reject(new Error(`MCP tool discovery timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", (err) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      reject(new Error(`Failed to start MCP stdio command: ${err.message}`));
    });

    child.on("close", (code) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      if (code !== 0) {
        reject(new Error(`MCP stdio discovery exited with code ${code}: ${stderr.trim()}`));
        return;
      }
      try {
        resolve(JSON.parse(String(stdout || "").trim() || "{}"));
      } catch {
        reject(new Error("MCP stdio discovery response is not valid JSON"));
      }
    });

    child.stdin.write(JSON.stringify(payload));
    child.stdin.end();
  });
}

async function tryStdioTools(server) {
  const args = interpolateStringArray(
    Array.isArray(server && server.args)
      ? server.args
      : Array.isArray(server && server.commandArgs)
        ? server.commandArgs
        : [],
  );
  const env = interpolateStringMap(server && server.env);

  if (shouldUseStdioJsonRpc(server)) {
    try {
      const rpc = await stdioListToolsJsonRpc({
        command: server.command,
        args,
        timeoutMs:
          Number(server && server.timeout_ms) > 0
            ? Math.min(Number(server.timeout_ms), 15000)
            : 15000,
        env,
      });
      const tools = normalizeTools(rpc);
      if (tools.length > 0) return tools;
    } catch {
      // fall back to legacy probes below
    }
  }

  const timeoutMs =
    Number(server && server.timeout_ms) > 0
      ? Math.min(Number(server.timeout_ms), 15000)
      : 3000;
  const candidates = ["tools/list", "list_tools", "tools"];
  for (const toolName of candidates) {
    try {
      const data = await callStdioProbe(
        server.command,
        args,
        { tool: toolName, input: {} },
        timeoutMs,
        env,
      );
      const tools = normalizeTools(data);
      if (tools.length > 0) return tools;
    } catch {
      // keep probing
    }
  }

  return [];
}

async function discoverMcpTools(server) {
  if (!server || (!server.url && !server.command)) return [];
  if (server.url) {
    const headers =
      interpolateStringMap(server.headers);
    const tools = await tryHttpTools(server.url, headers);
    if (tools.length > 0) return tools;
  }
  if (server.command) {
    const tools = await tryStdioTools(server);
    if (tools.length > 0) return tools;
  }
  return [];
}

module.exports = { normalizeTools, discoverMcpTools };
