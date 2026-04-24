// MCP Daemon - Persistent process manager for stateful MCP servers
// Listens on a Unix socket, maintains long-lived MCP server processes.

const net = require("net");
const path = require("path");
const os = require("os");
const fs = require("fs");
const { spawn } = require("child_process");

const SOCKET_PATH = path.join(os.homedir(), ".supercli", "mcp-daemon.sock");
const PID_FILE = path.join(os.homedir(), ".supercli", "mcp-daemon.pid");
const LOG_FILE = path.join(os.homedir(), ".supercli", "mcp-daemon.log");

function ensureDir() {
  const dir = path.dirname(SOCKET_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  process.stdout.write(line);
  try {
    fs.appendFileSync(LOG_FILE, line);
  } catch {}
}

// ─── Process Pool ─────────────────────────────────────────────────────────────

const pool = new Map(); // name → { child, state, nextId, pending, stderr, wireMode }

function frameMessage(obj, wireMode) {
  const body = JSON.stringify(obj);
  if (wireMode === "jsonl") return `${body}\n`;
  return `Content-Length: ${Buffer.byteLength(body, "utf-8")}\r\n\r\n${body}`;
}

function parseBufferMessages(state, chunk, onMessage) {
  const next = Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk), "utf-8");
  state.buffer = Buffer.concat([state.buffer, next]);
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
        try { onMessage(JSON.parse(body)); } catch {}
        continue;
      }
    }
    const newline = state.buffer.indexOf("\n");
    if (newline < 0) return;
    const line = state.buffer.slice(0, newline).toString("utf-8").trim();
    state.buffer = state.buffer.slice(newline + 1);
    if (!line) continue;
    try { onMessage(JSON.parse(line)); } catch {}
  }
}

function spawnMcpProcess(serverConfig) {
  const { command, args, env } = serverConfig;
  const child = spawn(command, args || [], {
    stdio: ["pipe", "pipe", "pipe"],
    shell: !Array.isArray(args) || args.length === 0,
    env: env && typeof env === "object" ? { ...process.env, ...env } : process.env,
  });
  return child;
}

async function initializeSession(entry) {
  return new Promise((resolve, reject) => {
    const id = entry.nextId++;
    const timer = setTimeout(() => {
      entry.pending.delete(id);
      reject(new Error("Initialize timed out after 10s"));
    }, 10000);

    entry.pending.set(id, {
      res: (v) => { clearTimeout(timer); resolve(v); },
      rej: (e) => { clearTimeout(timer); reject(e); },
    });

    entry.child.stdin.write(
      frameMessage({
        jsonrpc: "2.0", id, method: "initialize",
        params: {
          protocolVersion: "2025-06-18",
          capabilities: {},
          clientInfo: { name: "supercli-daemon", version: "1.0.0" },
        },
      }, entry.wireMode)
    );
  });
}

function sendNotification(entry, method, params) {
  entry.child.stdin.write(
    frameMessage({ jsonrpc: "2.0", method, params: params || {} }, entry.wireMode)
  );
}

async function getOrSpawnServer(name, serverConfig) {
  if (pool.has(name)) {
    const entry = pool.get(name);
    if (entry.state === "ready") return entry;
    if (entry.state === "initializing") {
      // Wait for initialization
      return new Promise((resolve, reject) => {
        const check = setInterval(() => {
          const e = pool.get(name);
          if (!e) { clearInterval(check); reject(new Error("Server was removed")); return; }
          if (e.state === "ready") { clearInterval(check); resolve(e); return; }
          if (e.state === "error") { clearInterval(check); reject(new Error("Server initialization failed")); return; }
        }, 50);
        setTimeout(() => { clearInterval(check); reject(new Error("Timeout waiting for server init")); }, 15000);
      });
    }
  }

  log(`Spawning MCP server: ${name} (${serverConfig.command})`);

  const child = spawnMcpProcess(serverConfig);
  const entry = {
    name,
    child,
    state: "initializing",
    nextId: 1,
    pending: new Map(),
    buffer: Buffer.alloc(0),
    stderr: "",
    wireMode: serverConfig.wire_mode || "jsonl",
    config: serverConfig,
  };

  pool.set(name, entry);

  child.stderr.on("data", (chunk) => { entry.stderr += chunk.toString(); });

  child.stdout.on("data", (chunk) => {
    const raw = chunk.toString("utf-8");
    // context-mode emits human-readable startup banner on stdout before JSON.
    // parseBufferMessages handles this: it skips non-JSON lines automatically.
    // We also handle the case where startup text is mixed with the first JSON response
    // by scanning for JSON objects embedded in the line stream.
    parseBufferMessages(entry, chunk, (msg) => {
      if (!msg || typeof msg !== "object") return;
      if (msg.id === undefined || msg.id === null) return;
      const pending = entry.pending.get(msg.id);
      if (!pending) return;
      entry.pending.delete(msg.id);
      if (msg.error) {
        pending.rej(Object.assign(new Error(msg.error.message || "JSON-RPC error"), { rpcError: msg.error }));
      } else {
        pending.res(msg.result);
      }
    });
  });

  child.on("error", (err) => {
    log(`MCP server '${name}' error: ${err.message}`);
    entry.state = "error";
    for (const p of entry.pending.values()) p.rej(err);
    entry.pending.clear();
    pool.delete(name);
  });

  child.on("close", (code) => {
    log(`MCP server '${name}' exited with code ${code}`);
    if (entry.state !== "stopped") {
      entry.state = "crashed";
      for (const p of entry.pending.values()) {
        p.rej(new Error(`MCP server '${name}' exited unexpectedly (code ${code})`));
      }
      entry.pending.clear();
      pool.delete(name);
    }
  });

  try {
    await initializeSession(entry);
    sendNotification(entry, "notifications/initialized", {});
    entry.state = "ready";
    log(`MCP server '${name}' ready`);
    return entry;
  } catch (err) {
    entry.state = "error";
    child.kill("SIGTERM");
    pool.delete(name);
    throw new Error(`Failed to initialize MCP server '${name}': ${err.message}`);
  }
}

async function callTool(serverName, serverConfig, toolName, input, timeoutMs) {
  const entry = await getOrSpawnServer(serverName, serverConfig);

  return new Promise((resolve, reject) => {
    const id = entry.nextId++;
    const timer = setTimeout(() => {
      entry.pending.delete(id);
      reject(new Error(`Tool call '${toolName}' timed out after ${timeoutMs}ms`));
    }, timeoutMs || 30000);

    entry.pending.set(id, {
      res: (v) => { clearTimeout(timer); resolve(v); },
      rej: (e) => { clearTimeout(timer); reject(e); },
    });

    entry.child.stdin.write(
      frameMessage({
        jsonrpc: "2.0", id, method: "tools/call",
        params: { name: toolName, arguments: input || {} },
      }, entry.wireMode)
    );
  });
}

async function listTools(serverName, serverConfig) {
  const entry = await getOrSpawnServer(serverName, serverConfig);

  return new Promise((resolve, reject) => {
    const id = entry.nextId++;
    const timer = setTimeout(() => {
      entry.pending.delete(id);
      reject(new Error("tools/list timed out after 10s"));
    }, 10000);

    entry.pending.set(id, {
      res: (v) => { clearTimeout(timer); resolve(v); },
      rej: (e) => { clearTimeout(timer); reject(e); },
    });

    entry.child.stdin.write(
      frameMessage({ jsonrpc: "2.0", id, method: "tools/list", params: {} }, entry.wireMode)
    );
  });
}

// ─── Socket Server ─────────────────────────────────────────────────────────────

function handleRequest(req) {
  const { id, method, params } = req;

  if (method === "ping") {
    return Promise.resolve({ pong: true, pid: process.pid, servers: [...pool.keys()] });
  }

  if (method === "call_tool") {
    const { server, serverConfig, tool, input, timeout_ms } = params || {};
    if (!server || !serverConfig || !tool) {
      return Promise.reject(new Error("call_tool requires server, serverConfig, tool"));
    }
    return callTool(server, serverConfig, tool, input, timeout_ms);
  }

  if (method === "list_tools") {
    const { server, serverConfig } = params || {};
    if (!server || !serverConfig) {
      return Promise.reject(new Error("list_tools requires server, serverConfig"));
    }
    return listTools(server, serverConfig).then(result => ({
      tools: (result && Array.isArray(result.tools)) ? result.tools : [],
    }));
  }

  if (method === "list_servers") {
    const servers = [...pool.entries()].map(([name, e]) => ({
      name,
      state: e.state,
      pid: e.child && e.child.pid,
    }));
    return Promise.resolve({ servers });
  }

  if (method === "stop_server") {
    const { server } = params || {};
    if (server && pool.has(server)) {
      const entry = pool.get(server);
      entry.state = "stopped";
      try { entry.child.kill("SIGTERM"); } catch {}
      pool.delete(server);
      return Promise.resolve({ ok: true, stopped: server });
    }
    return Promise.resolve({ ok: false, message: `Server '${server}' not found` });
  }

  if (method === "shutdown") {
    setImmediate(() => gracefulShutdown());
    return Promise.resolve({ ok: true });
  }

  return Promise.reject(new Error(`Unknown method: ${method}`));
}

function startSocketServer() {
  const server = net.createServer((socket) => {
    let buffer = "";

    socket.on("data", (chunk) => {
      buffer += chunk.toString("utf-8");
      const lines = buffer.split("\n");
      buffer = lines.pop();
      for (const line of lines) {
        if (!line.trim()) continue;
        let req;
        try { req = JSON.parse(line); } catch { continue; }
        handleRequest(req)
          .then((result) => {
            socket.write(JSON.stringify({ id: req.id, result }) + "\n");
          })
          .catch((err) => {
            socket.write(JSON.stringify({ id: req.id, error: { message: err.message } }) + "\n");
          });
      }
    });

    socket.on("error", () => {});
  });

  server.on("error", (err) => {
    log(`Socket server error: ${err.message}`);
    process.exit(1);
  });

  server.listen(SOCKET_PATH, () => {
    log(`MCP daemon listening on ${SOCKET_PATH} (pid ${process.pid})`);
  });

  return server;
}

function gracefulShutdown() {
  log("Shutting down MCP daemon...");
  for (const [name, entry] of pool.entries()) {
    entry.state = "stopped";
    try { entry.child.kill("SIGTERM"); } catch {}
    log(`Stopped MCP server: ${name}`);
  }
  pool.clear();
  try { fs.unlinkSync(SOCKET_PATH); } catch {}
  try { fs.unlinkSync(PID_FILE); } catch {}
  process.exit(0);
}

function main() {
  ensureDir();

  // Remove stale socket
  if (fs.existsSync(SOCKET_PATH)) {
    try { fs.unlinkSync(SOCKET_PATH); } catch {}
  }

  // Write PID file
  fs.writeFileSync(PID_FILE, String(process.pid));

  process.on("SIGTERM", gracefulShutdown);
  process.on("SIGINT", gracefulShutdown);
  process.on("uncaughtException", (err) => {
    log(`Uncaught exception: ${err.message}`);
    gracefulShutdown();
  });

  startSocketServer();
}

module.exports = { SOCKET_PATH, PID_FILE };

if (require.main === module) {
  main();
}
