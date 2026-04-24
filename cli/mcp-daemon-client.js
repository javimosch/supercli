// MCP Daemon Client - Connects to the MCP daemon via Unix socket
// Used by the MCP adapter to call stateful MCP servers.

const net = require("net");
const path = require("path");
const os = require("os");
const { spawn } = require("child_process");

const SOCKET_PATH = path.join(os.homedir(), ".supercli", "mcp-daemon.sock");
const DAEMON_SCRIPT = path.join(__dirname, "mcp-daemon.js");

let nextRequestId = 1;

// ─── Low-level socket communication ───────────────────────────────────────────

function sendDaemonRequest(method, params, timeoutMs) {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection(SOCKET_PATH);
    const reqId = nextRequestId++;
    let buffer = "";
    let settled = false;

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      socket.destroy();
      reject(new Error(`Daemon request '${method}' timed out after ${timeoutMs || 30000}ms`));
    }, timeoutMs || 30000);

    socket.on("connect", () => {
      socket.write(JSON.stringify({ id: reqId, method, params: params || {} }) + "\n");
    });

    socket.on("data", (chunk) => {
      buffer += chunk.toString("utf-8");
      const lines = buffer.split("\n");
      buffer = lines.pop();
      for (const line of lines) {
        if (!line.trim()) continue;
        let msg;
        try { msg = JSON.parse(line); } catch { continue; }
        if (msg.id !== reqId) continue;
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        socket.destroy();
        if (msg.error) {
          reject(Object.assign(new Error(msg.error.message || "Daemon error"), { daemonError: msg.error }));
        } else {
          resolve(msg.result);
        }
        return;
      }
    });

    socket.on("error", (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(err);
    });

    socket.on("close", () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(new Error("Daemon connection closed unexpectedly"));
    });
  });
}

// ─── Daemon lifecycle ──────────────────────────────────────────────────────────

async function isDaemonRunning() {
  try {
    const result = await sendDaemonRequest("ping", {}, 3000);
    return result && result.pong === true;
  } catch {
    return false;
  }
}

async function startDaemon() {
  const child = spawn(process.execPath, [DAEMON_SCRIPT], {
    detached: true,
    stdio: "ignore",
  });
  child.unref();

  // Wait for daemon to be ready (up to 5s)
  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 200));
    if (await isDaemonRunning()) return { ok: true, pid: child.pid };
  }
  throw new Error("Daemon failed to start within 5 seconds");
}

async function stopDaemon() {
  try {
    return await sendDaemonRequest("shutdown", {}, 5000);
  } catch {
    return { ok: false, message: "Daemon not running" };
  }
}

async function daemonStatus() {
  try {
    return await sendDaemonRequest("ping", {}, 3000);
  } catch {
    return { running: false };
  }
}

async function ensureDaemonRunning() {
  if (await isDaemonRunning()) return;
  await startDaemon();
}

// ─── Tool call via daemon ──────────────────────────────────────────────────────

async function callDaemonTool({ server, serverConfig, tool, input, timeout_ms }) {
  if (!await isDaemonRunning()) {
    try {
      await startDaemon();
    } catch (startErr) {
      throw Object.assign(
        new Error(
          `MCP daemon is not running and auto-start failed: ${startErr.message}\n` +
          `Start it manually with: supercli mcp daemon start`
        ),
        { code: 105, type: "integration_error", recoverable: false }
      );
    }
  }

  const result = await sendDaemonRequest("call_tool", {
    server,
    serverConfig,
    tool,
    input,
    timeout_ms,
  }, (timeout_ms || 30000) + 5000);

  return result;
}

async function listDaemonTools({ server, serverConfig }) {
  if (!await isDaemonRunning()) {
    try {
      await startDaemon();
    } catch (startErr) {
      throw Object.assign(
        new Error(
          `MCP daemon is not running and auto-start failed: ${startErr.message}\n` +
          `Start it manually with: supercli mcp daemon start`
        ),
        { code: 105, type: "integration_error", recoverable: false }
      );
    }
  }

  return sendDaemonRequest("list_tools", { server, serverConfig }, 15000);
}

async function listDaemonServers() {
  return sendDaemonRequest("list_servers", {}, 3000);
}

async function stopDaemonServer(server) {
  return sendDaemonRequest("stop_server", { server }, 5000);
}

module.exports = {
  SOCKET_PATH,
  isDaemonRunning,
  startDaemon,
  stopDaemon,
  daemonStatus,
  ensureDaemonRunning,
  callDaemonTool,
  listDaemonTools,
  listDaemonServers,
  stopDaemonServer,
};
