// MCP Adapter
// Supports HTTP MCP endpoints and local stdio MCP commands.
// Stateful MCP servers are routed through the MCP daemon.

const { spawn } = require("child_process");
const {
  shouldUseStdioJsonRpc,
  stdioCallToolJsonRpc,
} = require("../mcp-stdio-jsonrpc");
const { callDaemonTool, listDaemonTools } = require("../mcp-daemon-client");

function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function interpolateEnvPlaceholders(text) {
  if (typeof text !== "string") return text;
  return text.replace(/\$\{([A-Z0-9_]+)\}/g, (_, name) => process.env[name] || "");
}

function asStringMap(value) {
  const obj = asObject(value);
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (typeof k === "string" && typeof v === "string") out[k] = interpolateEnvPlaceholders(v);
  }
  return out;
}

function asStringArray(value) {
  if (!Array.isArray(value)) return [];
  return value.filter((v) => typeof v === "string").map((v) => interpolateEnvPlaceholders(v));
}

function mergeMcpConfig(cmdConfig, serverEntry) {
  const mergedHeaders = {
    ...asStringMap(serverEntry && serverEntry.headers),
    ...asStringMap(cmdConfig.headers),
  };
  const mergedEnv = {
    ...asStringMap(serverEntry && serverEntry.env),
    ...asStringMap(cmdConfig.env),
  };
  const mergedArgs = [
    ...asStringArray(serverEntry && serverEntry.args),
    ...asStringArray(serverEntry && serverEntry.commandArgs),
    ...asStringArray(cmdConfig.args),
    ...asStringArray(cmdConfig.commandArgs),
  ];

  return {
    tool: cmdConfig.tool,
    server: cmdConfig.server,
    url: interpolateEnvPlaceholders(cmdConfig.url || (serverEntry && serverEntry.url)),
    command: cmdConfig.command || (serverEntry && serverEntry.command),
    mcp_protocol: cmdConfig.mcp_protocol || (serverEntry && serverEntry.mcp_protocol),
    mcp_wire: cmdConfig.mcp_wire || (serverEntry && serverEntry.mcp_wire),
    stateful: cmdConfig.stateful !== undefined ? cmdConfig.stateful : (serverEntry && serverEntry.stateful),
    timeout_ms:
      cmdConfig.timeout_ms !== undefined
        ? cmdConfig.timeout_ms
        : serverEntry && serverEntry.timeout_ms,
    headers: mergedHeaders,
    env: mergedEnv,
    args: mergedArgs,
  };
}

async function callStdioTool(command, args, payload, timeoutMs, env) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args || [], {
      stdio: ["pipe", "pipe", "pipe"],
      shell: !Array.isArray(args) || args.length === 0,
      env: env && typeof env === "object" ? { ...process.env, ...env } : process.env,
    });

    let stdout = "";
    let stderr = "";
    let settled = false;

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      child.kill("SIGTERM");
      reject(
        Object.assign(
          new Error(`MCP stdio call timed out after ${timeoutMs}ms`),
          {
            code: 105,
            type: "integration_error",
            recoverable: true,
          },
        ),
      );
    }, timeoutMs);

    child.stdout.setEncoding("utf-8");
    child.stderr.setEncoding("utf-8");
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });

    child.on("error", (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(
        Object.assign(
          new Error(`Failed to start MCP stdio command: ${err.message}`),
          {
            code: 105,
            type: "integration_error",
            recoverable: true,
          },
        ),
      );
    });

    child.on("close", (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (code !== 0) {
        reject(
          Object.assign(
            new Error(
              `MCP stdio command exited with code ${code}: ${stderr.trim()}`,
            ),
            {
              code: 105,
              type: "integration_error",
              recoverable: true,
            },
          ),
        );
        return;
      }
      try {
        resolve(JSON.parse(stdout.trim()));
      } catch {
        reject(
          Object.assign(
            new Error(`MCP stdio response is not valid JSON: ${stdout.trim()}`),
            {
              code: 105,
              type: "integration_error",
              recoverable: true,
            },
          ),
        );
      }
    });

    child.stdin.write(JSON.stringify(payload));
    child.stdin.end();
  });
}

async function resolveServerEntry(config, context) {
  if (config.server && context.config && Array.isArray(context.config.mcp_servers)) {
    const local = context.config.mcp_servers.find(
      (s) => s && s.name === config.server,
    );
    if (local) return local;
  }

  if (config.server && context.server) {
    const r = await fetch(`${context.server}/api/mcp?format=json`);
    if (!r.ok) {
      throw Object.assign(
        new Error(`Failed to fetch MCP servers list: ${r.status}`),
        {
          code: 105,
          type: "integration_error",
          recoverable: true,
        },
      );
    }
    const servers = await r.json();
    const srv = servers.find((s) => s && s.name === config.server);
    if (srv) return srv;
  }

  if (config.url || config.command) return {};

  throw Object.assign(
    new Error(
      `MCP server '${config.server}' not found in local config. Add one with: supercli mcp add ${config.server} --url <mcp_url> or run supercli sync`,
    ),
    {
      code: 85,
      type: "invalid_argument",
      recoverable: false,
    },
  );
}

async function execute(cmd, flags, context) {
  const cmdConfig = cmd.adapterConfig || {};
  const toolName = cmdConfig.tool;
  const hasDeclaredSource = !!(cmdConfig.server || cmdConfig.url || cmdConfig.command);

  if (!toolName || !hasDeclaredSource) {
    throw new Error(
      "MCP adapter requires 'tool' and one of: 'server', 'url', or 'command' in adapterConfig",
    );
  }

  const serverEntry = cmdConfig.server
    ? await resolveServerEntry(cmdConfig, context)
    : {};
  const config = mergeMcpConfig(cmdConfig, serverEntry);
  const hasStdioSource = !!config.command;
  const hasHttpSource = !!config.url;

  const input = {};
  for (const [k, v] of Object.entries(flags)) {
    if (!["human", "json", "compact"].includes(k)) {
      input[k] = v;
    }
  }

  if (hasStdioSource) {
    const commandArgs = Array.isArray(config.args) ? config.args : [];
    const timeoutMs =
      Number(config.timeout_ms) > 0 ? Number(config.timeout_ms) : 10000;

    // Route stateful MCP servers through the daemon
    if (config.stateful) {
      const serverConfig = {
        command: config.command,
        args: commandArgs,
        env: config.env,
      };
      return callDaemonTool({
        server: config.server || config.command,
        serverConfig,
        tool: toolName,
        input,
        timeout_ms: timeoutMs,
      });
    }

    if (shouldUseStdioJsonRpc(config)) {
      return stdioCallToolJsonRpc({
        command: config.command,
        args: commandArgs,
        timeoutMs,
        env: config.env,
        tool: toolName,
        input,
      });
    }
    return callStdioTool(
      config.command,
      commandArgs,
      { tool: toolName, input },
      timeoutMs,
      config.env,
    );
  }

  if (!hasHttpSource) {
    throw new Error(
      "MCP adapter could not resolve a source. Define adapterConfig.url/command or configure the named server with url/command.",
    );
  }

  const toolUrl = config.url.replace(/\/+$/, "");
  const tr = await fetch(`${toolUrl}/tool`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(config.headers || {}) },
    body: JSON.stringify({ tool: toolName, input }),
  });

  if (!tr.ok) {
    const text = await tr.text().catch(() => "");
    throw Object.assign(
      new Error(`MCP tool call failed: ${tr.status} ${text}`),
      {
        code: 105,
        type: "integration_error",
        recoverable: true,
      },
    );
  }

  return tr.json();
}

module.exports = { execute };
