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
const DEFAULT_PORT = 8320;
const SHUTDOWN_GRACE_MS = 2000;

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
      send(res, 200, { ok: true, service: "sc", pid: process.pid });
      return;
    }
    if (req.method === "POST" && url === "/_shutdown") {
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

  const cleanup = () => shutdown(server);
  process.on("SIGTERM", cleanup);
  process.on("SIGINT", cleanup);

  // Keep the daemon's real job: heartbeat + periodic log sync/prune.
  if (deps && typeof deps.runLoop === "function") deps.runLoop();
}

function shutdown(server) {
  try { fs.unlinkSync(PID_FILE); } catch {}
  server.close();
  setTimeout(() => process.exit(0), SHUTDOWN_GRACE_MS).unref();
}

module.exports = { handleServe, resolveBind, isLoopback, DEFAULT_PORT, PID_FILE, TOKEN_FILE };
