"use strict";

// serve — cli-daemon-spec §1: foreground HTTP server, loopback by default.
// `sc serve --host H --port P` is the primitive `sc daemon start` backgrounds.
// Exposes GET /_health (open) and POST /_shutdown (token-gated off-loopback)
// and runs the bookkeeper loop (heartbeat + log sync + prune) so the managed
// daemon keeps doing its job.

const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");
const crypto = require("crypto");

const SUPERCLI_DIR = path.join(os.homedir(), ".supercli");
const PID_FILE = path.join(SUPERCLI_DIR, "daemon.pid");
const TOKEN_FILE = path.join(SUPERCLI_DIR, "shutdown.token");
const STATS_FILE = path.join(SUPERCLI_DIR, "daemon-stats.json");
const DEFAULT_PORT = 8320;
const SHUTDOWN_GRACE_MS = 2000;

// Local observability (not telemetry — cli-telemetry-spec forbids per-request
// events): is anything besides our own CLI probing this server? Our fetch
// (undici) identifies itself in the UA; anything else counts as external.
const stats = { started_at: null, last_stopped_at: null, health_hits_self: 0, health_hits_external: 0, shutdown_reqs: 0 };
let statsTimer = null;

function writeStats() {
  try {
    fs.mkdirSync(SUPERCLI_DIR, { recursive: true });
    fs.writeFileSync(STATS_FILE + ".tmp", JSON.stringify(stats));
    fs.renameSync(STATS_FILE + ".tmp", STATS_FILE);
  } catch {}
}

function isSelfProbe(req) {
  const ua = String(req.headers["user-agent"] || "");
  return ua.includes("undici") || ua.includes("node");
}

function isLoopback(host) {
  return host === "127.0.0.1" || host === "localhost" || host === "::1";
}

function resolveBind(flags) {
  let host = process.env.SUPERCLI_HOST || "127.0.0.1";
  let port = parseInt(process.env.SUPERCLI_PORT || "", 10) || DEFAULT_PORT;
  if (flags.bind) {
    const s = String(flags.bind);
    const i = s.lastIndexOf(":");
    if (i > 0) { host = s.slice(0, i); port = parseInt(s.slice(i + 1), 10) || port; }
  }
  if (flags.host) host = String(flags.host);
  if (flags.port) port = parseInt(String(flags.port), 10) || port;
  return { host, port };
}

function writeToken() {
  fs.mkdirSync(SUPERCLI_DIR, { recursive: true });
  const token = crypto.randomBytes(32).toString("hex");
  fs.writeFileSync(TOKEN_FILE, token, { mode: 0o600 });
  return token;
}

function send(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, { "content-type": "application/json", "content-length": Buffer.byteLength(body) });
  res.end(body);
}

// Foreground — never returns until shutdown/signal.
async function handleServe(flags, deps) {
  const { host, port } = resolveBind(flags || {});
  const token = writeToken();
  const gated = !isLoopback(host);

  fs.mkdirSync(SUPERCLI_DIR, { recursive: true });
  fs.writeFileSync(PID_FILE, String(process.pid));

  const server = http.createServer((req, res) => {
    const url = (req.url || "").split("?")[0];
    if (req.method === "GET" && url === "/_health") {
      if (isSelfProbe(req)) stats.health_hits_self++; else stats.health_hits_external++;
      writeStats();
      send(res, 200, { ok: true, service: "sc", pid: process.pid });
      return;
    }
    if (req.method === "POST" && url === "/_shutdown") {
      stats.shutdown_reqs++;
      writeStats();
      if (gated) {
        const auth = req.headers.authorization || "";
        if (auth !== `Bearer ${token}`) {
          send(res, 403, { ok: false, error: { code: 70, type: "auth", message: "shutdown token required off-loopback", recoverable: false } });
          return;
        }
      }
      send(res, 200, { ok: true, stopping: true });
      setTimeout(() => shutdown(server), 50); // let the response flush first
      return;
    }
    send(res, 404, { ok: false, error: { code: 90, type: "resource_not_found", message: `no route ${req.method} ${url}`, recoverable: false, suggestions: ["/_health", "/_shutdown"] } });
  });

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, resolve);
  });

  process.stderr.write(`[serve] listening on http://${host}:${port}\n`);

  stats.started_at = new Date().toISOString();
  writeStats();
  statsTimer = setInterval(writeStats, 30000);
  statsTimer.unref();

  const cleanup = () => shutdown(server);
  process.on("SIGTERM", cleanup);
  process.on("SIGINT", cleanup);

  // Keep the daemon's real job: heartbeat + periodic log sync/prune.
  if (deps && typeof deps.runLoop === "function") deps.runLoop();
}

function shutdown(server) {
  stats.last_stopped_at = new Date().toISOString();
  writeStats();
  if (statsTimer) clearInterval(statsTimer);
  try { fs.unlinkSync(PID_FILE); } catch {}
  server.close();
  setTimeout(() => process.exit(0), SHUTDOWN_GRACE_MS).unref();
}

module.exports = { handleServe, resolveBind, isLoopback, DEFAULT_PORT, PID_FILE, TOKEN_FILE, STATS_FILE };
