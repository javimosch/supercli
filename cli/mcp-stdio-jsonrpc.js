const { spawn } = require("child_process");

function asStringArray(value) {
  if (!Array.isArray(value)) return [];
  return value.filter((v) => typeof v === "string");
}

function shouldUseStdioJsonRpc(config = {}) {
  if (config.mcp_protocol === "jsonrpc") return true;
  const args = [
    ...asStringArray(config.args),
    ...asStringArray(config.commandArgs),
  ];
  return args.includes("mcp-remote");
}

function detectWireMode(config = {}) {
  if (config.mcp_wire === "jsonl") return "jsonl";
  if (config.mcp_wire === "lsp") return "lsp";
  const args = [
    ...asStringArray(config.args),
    ...asStringArray(config.commandArgs),
  ];
  if (args.includes("mcp-remote")) return "jsonl";
  return "lsp";
}

function parseBufferMessages(state, chunk, onMessage) {
  const nextChunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk), "utf-8");
  state.buffer = Buffer.concat([state.buffer, nextChunk]);

  while (state.buffer.length > 0) {
    const headerEnd = state.buffer.indexOf("\r\n\r\n");
    if (headerEnd >= 0) {
      const headerText = state.buffer.slice(0, headerEnd).toString("utf-8");
      const match = headerText.match(/Content-Length:\s*(\d+)/i);
      if (match) {
        const length = Number(match[1]);
        const total = headerEnd + 4 + length;
        if (state.buffer.length < total) return;
        const body = state.buffer.slice(headerEnd + 4, total).toString("utf-8");
        state.buffer = state.buffer.slice(total);
        try {
          onMessage(JSON.parse(body));
        } catch {
          // ignore parse errors for malformed messages
        }
        continue;
      }
    }

    const newline = state.buffer.indexOf("\n");
    if (newline < 0) return;
    const line = state.buffer.slice(0, newline).toString("utf-8").trim();
    state.buffer = state.buffer.slice(newline + 1);
    if (!line) continue;
    try {
      onMessage(JSON.parse(line));
    } catch {
      // ignore non-json lines
    }
  }
}

function buildRpcError(error, fallback) {
  const msg =
    (error && typeof error.message === "string" && error.message) ||
    fallback ||
    "MCP JSON-RPC error";
  return Object.assign(new Error(msg), {
    code: 105,
    type: "integration_error",
    recoverable: true,
  });
}

function runJsonRpcSession(options) {
  const {
    command,
    args,
    env,
    timeoutMs,
    operation,
    tool,
    input,
    protocolVersion = "2025-06-18",
    wireMode = "lsp",
  } = options;

  return new Promise((resolve, reject) => {
    const child = spawn(command, args || [], {
      stdio: ["pipe", "pipe", "pipe"],
      shell: !Array.isArray(args) || args.length === 0,
      env: env && typeof env === "object" ? { ...process.env, ...env } : process.env,
    });

    const state = {
      buffer: Buffer.alloc(0),
      settled: false,
      nextId: 1,
      pending: new Map(),
      stderr: "",
    };

    function settleError(err) {
      if (state.settled) return;
      state.settled = true;
      clearTimeout(timer);
      try {
        child.kill("SIGTERM");
      } catch {
        // ignore kill errors
      }
      reject(err);
    }

    function settleOk(value) {
      if (state.settled) return;
      state.settled = true;
      clearTimeout(timer);
      try {
        child.kill("SIGTERM");
      } catch {
        // ignore kill errors
      }
      resolve(value);
    }

    function frame(obj) {
      const body = JSON.stringify(obj);
      if (wireMode === "jsonl") return `${body}\n`;
      return `Content-Length: ${Buffer.byteLength(body, "utf-8")}\r\n\r\n${body}`;
    }

    function sendRequest(method, params) {
      return new Promise((res, rej) => {
        const id = state.nextId++;
        state.pending.set(id, { res, rej });
        child.stdin.write(
          frame({ jsonrpc: "2.0", id, method, params: params || {} }),
        );
      });
    }

    function sendNotification(method, params) {
      child.stdin.write(
        frame({ jsonrpc: "2.0", method, params: params || {} }),
      );
    }

    const timer = setTimeout(() => {
      settleError(buildRpcError(null, `MCP stdio JSON-RPC timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    child.stderr.on("data", (chunk) => {
      state.stderr += chunk.toString();
    });

    child.stdout.on("data", (chunk) => {
      parseBufferMessages(state, chunk, (msg) => {
        if (!msg || typeof msg !== "object") return;
        if (msg.id === undefined || msg.id === null) return;
        const pending = state.pending.get(msg.id);
        if (!pending) return;
        state.pending.delete(msg.id);
        if (msg.error) {
          pending.rej(buildRpcError(msg.error, `MCP JSON-RPC error: ${msg.error.message || "unknown"}`));
          return;
        }
        pending.res(msg.result);
      });
    });

    child.on("error", (err) => {
      settleError(buildRpcError(err, `Failed to start MCP stdio command: ${err.message}`));
    });

    child.on("close", (code) => {
      if (state.settled) return;
      if (code === 0) {
        settleError(
          buildRpcError(
            null,
            "MCP stdio JSON-RPC session ended before operation completed",
          ),
        );
        return;
      }
      settleError(
        buildRpcError(
          null,
          `MCP stdio command exited with code ${code}: ${state.stderr.trim()}`,
        ),
      );
    });

    (async () => {
      try {
        await sendRequest("initialize", {
          protocolVersion,
          capabilities: {},
          clientInfo: { name: "supercli", version: "1.0.0" },
        });
        sendNotification("notifications/initialized", {});

        if (operation === "list_tools") {
          const result = await sendRequest("tools/list", {});
          const tools = result && Array.isArray(result.tools) ? result.tools : [];
          settleOk({ tools });
          return;
        }

        const result = await sendRequest("tools/call", {
          name: tool,
          arguments: input || {},
        });
        settleOk(result);
      } catch (err) {
        settleError(buildRpcError(err, err.message));
      }
    })();
  });
}

async function stdioListToolsJsonRpc(options) {
  return runJsonRpcSession({
    ...options,
    operation: "list_tools",
    wireMode: options.wireMode || detectWireMode(options),
  });
}

async function stdioCallToolJsonRpc(options) {
  return runJsonRpcSession({
    ...options,
    operation: "call_tool",
    wireMode: options.wireMode || detectWireMode(options),
  });
}

module.exports = {
  shouldUseStdioJsonRpc,
  detectWireMode,
  stdioListToolsJsonRpc,
  stdioCallToolJsonRpc,
};
