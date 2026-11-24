"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawn } = require("child_process");
const { getClientId } = require("./config-core");
const { CLI_VERSION } = require("./arg-parser");

const SUPERCLI_DIR = path.join(os.homedir(), ".supercli");
const LOGS_DIR = path.join(SUPERCLI_DIR, "logs");
const PID_FILE = path.join(SUPERCLI_DIR, "daemon.pid");
const HEARTBEAT_FILE = path.join(SUPERCLI_DIR, "daemon.heartbeat");
const CONFIG_FILE = path.join(SUPERCLI_DIR, "daemon.json");

// Default daemon configuration
const DEFAULT_CONFIG = {
  enabled: true,
  sync_interval_seconds: 60,
  log_retention_hours: 24,
  server_url: "http://localhost:3000",
};

// Ensure directories exist
function ensureDirectories() {
  if (!fs.existsSync(SUPERCLI_DIR)) {
    fs.mkdirSync(SUPERCLI_DIR, { recursive: true });
  }
  if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
  }
}

// Load daemon configuration. SUPERCLI_SERVER env overrides daemon.json —
// workers in a federation set the env var, they shouldn't have to edit a file.
function loadConfig() {
  ensureDirectories();
  if (!fs.existsSync(CONFIG_FILE)) {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(DEFAULT_CONFIG, null, 2));
  }
  let fileConfig = {};
  try {
    fileConfig = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
  } catch (err) {}
  const config = { ...DEFAULT_CONFIG, ...fileConfig };
  if (process.env.SUPERCLI_SERVER) config.server_url = process.env.SUPERCLI_SERVER;
  return config;
}

// Get daily log file path
function getLogFilePath() {
  const date = new Date().toISOString().split("T")[0];
  return path.join(LOGS_DIR, `jobs-${date}.jsonl`);
}

// Write log entry to daily log file
function writeLog(logEntry) {
  ensureDirectories();
  const logFile = getLogFilePath();
  const entry = { ...logEntry, synced: false };
  fs.appendFileSync(logFile, JSON.stringify(entry) + "\n");
}

// ----- cli-daemon-spec lifecycle (health-probe based) ------------------------
// `daemon start|stop|status` manage `sc serve` (cli/serve.js) over its HTTP
// surface rather than the PID file — a probe asks the process itself "are you
// healthy and are you actually sc", which can't be fooled by PID reuse.

const { resolveBind, TOKEN_FILE, STATS_FILE } = require("./serve");
const telemetry = require("./telemetry");
const DAEMON_LOG = path.join(LOGS_DIR, "daemon.log");

async function probeHealth(host, port, timeoutMs = 800) {
  try {
    const res = await fetch(`http://${host}:${port}/_health`, {
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) return null;
    const body = await res.json();
    return body && body.service === "sc" ? body : null;
  } catch {
    return null;
  }
}

// Start daemon process — spec §4: detached serve + bounded health poll.
async function startDaemon(opts = {}) {
  const { host, port } = resolveBind(opts);
  if (await probeHealth(host, port)) {
    return { ok: true, daemon: "already_running", host, port, code: 0 };
  }

  ensureDirectories();
  const config = loadConfig();
  if (!config.enabled) {
    return { ok: false, error: { code: 80, type: "input_error", message: "Daemon is disabled in config", recoverable: false }, code: 80 };
  }

  // A legacy pre-HTTP bookkeeper (daemon.js --daemon) may still be running:
  // /_health can't see it, and its PID file would make it look stopped while it
  // keeps shipping logs in parallel with the new serve. SIGTERM it first.
  if (fs.existsSync(PID_FILE)) {
    try {
      const pid = parseInt(fs.readFileSync(PID_FILE, "utf8").trim());
      process.kill(pid, "SIGTERM");
    } catch {}
    try { fs.unlinkSync(PID_FILE); } catch {}
  }

  const supercliScript = path.join(__dirname, "supercli.js");
  const logFd = fs.openSync(DAEMON_LOG, "a");
  const child = spawn(process.execPath, [supercliScript, "serve", "--host", host, "--port", String(port)], {
    detached: true,
    stdio: ["ignore", logFd, logFd],
  });
  child.unref();
  fs.closeSync(logFd);

  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) {
    if (await probeHealth(host, port)) {
      return { ok: true, daemon: "started", host, port, log: DAEMON_LOG, code: 0 };
    }
    await new Promise((r) => setTimeout(r, 100));
  }
  let tail = "";
  try {
    tail = fs.readFileSync(DAEMON_LOG, "utf8").split("\n").filter(Boolean).slice(-5).join("\n");
  } catch {}
  return { ok: false, error: { code: 100, type: "external_failure", message: `daemon did not become healthy within 5s${tail ? " — log tail: " + tail : ""}`, recoverable: true }, code: 100 };
}

// Stop daemon — spec §4: health probe → /_shutdown → confirm dead. Also
// SIGTERMs a legacy pre-HTTP bookkeeper daemon so upgrades don't orphan it.
async function stopDaemon(opts = {}) {
  const { host, port } = resolveBind(opts);
  const health = await probeHealth(host, port);

  if (!health) {
    let killedLegacy = false;
    if (fs.existsSync(PID_FILE)) {
      try {
        const pid = parseInt(fs.readFileSync(PID_FILE, "utf8").trim());
        process.kill(pid, "SIGTERM");
        killedLegacy = true;
      } catch {}
      try { fs.unlinkSync(PID_FILE); } catch {}
    }
    return { ok: true, daemon: killedLegacy ? "stopped" : "already_stopped", code: 0 };
  }

  // Send the token whenever we have it — required off-loopback, harmless on.
  const headers = {};
  try { headers.authorization = `Bearer ${fs.readFileSync(TOKEN_FILE, "utf8").trim()}`; } catch {}
  try {
    await fetch(`http://${host}:${port}/_shutdown`, {
      method: "POST",
      headers,
      signal: AbortSignal.timeout(2000),
    });
  } catch {
    return { ok: false, error: { code: 110, type: "internal_error", message: "daemon unreachable during shutdown request", recoverable: true }, code: 110 };
  }

  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) {
    if (!(await probeHealth(host, port))) {
      try { fs.unlinkSync(PID_FILE); } catch {}
      return { ok: true, daemon: "stopped", code: 0 };
    }
    await new Promise((r) => setTimeout(r, 100));
  }
  return { ok: false, error: { code: 110, type: "internal_error", message: "daemon still responding 5s after /_shutdown", recoverable: true }, code: 110 };
}

// Status — spec §4: health probe only, exit 3 when stopped (steady state).
// Merges the serve-written daemon-stats.json (local observability — is anything
// external probing the HTTP surface?) so `daemon status` shows usage, not just liveness.
function readStats() {
  try { return JSON.parse(fs.readFileSync(STATS_FILE, "utf8")); } catch { return null; }
}

async function getDaemonStatus(opts = {}) {
  const { host, port } = resolveBind(opts);
  const health = await probeHealth(host, port);
  const stats = readStats();
  if (health) {
    const r = { ok: true, daemon: "running", host, port, pid: health.pid, code: 0 };
    if (stats && stats.started_at) {
      r.uptime_s = Math.floor((Date.now() - new Date(stats.started_at).getTime()) / 1000);
      r.health_hits_self = stats.health_hits_self;
      r.health_hits_external = stats.health_hits_external;
      r.shutdown_reqs = stats.shutdown_reqs;
    }
    return r;
  }
  const r = { ok: true, daemon: "stopped", host, port, code: 3 };
  if (stats && stats.started_at) r.last_run = stats;
  return r;
}

// Write heartbeat timestamp
function writeHeartbeat() {
  ensureDirectories();
  fs.writeFileSync(HEARTBEAT_FILE, new Date().toISOString());
}


// Sync logs to server
async function syncLogs(config) {
  const logFile = getLogFilePath();
  if (!fs.existsSync(logFile)) {
    return { synced: 0, errors: 0 };
  }

  const lines = fs.readFileSync(logFile, "utf8").split("\n").filter(Boolean);
  const unsyncedLogs = [];

  for (const line of lines) {
    try {
      const log = JSON.parse(line);
      if (!log.synced) {
        unsyncedLogs.push(log);
      }
    } catch (err) {
      // Skip invalid lines
    }
  }

  if (unsyncedLogs.length === 0) {
    return { synced: 0, errors: 0 };
  }

  let synced = 0;
  let errors = 0;

  // Upload logs one at a time (server expects single job object)
  for (const log of unsyncedLogs) {
    try {
      const headers = { "Content-Type": "application/json" };
      const apiKey = process.env.SUPERCLI_API_KEY;
      if (apiKey) {
        headers["X-API-Key"] = apiKey;
      }

      const response = await fetch(`${config.server_url}/api/jobs`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          command: log.command,
          args: log.args,
          status: log.status,
          duration_ms: log.duration_ms,
          timestamp: log.timestamp,
          client_id: log.client_id,
        }),
      });

      if (response.ok) {
        synced++;
        // Mark log as synced
        updateSyncStatus(logFile, [log.timestamp]);
      } else {
        errors++;
      }
    } catch (err) {
      errors++;
    }
  }

  return { synced, errors };
}

// Update sync status in log file
function updateSyncStatus(logFile, timestamps) {
  const lines = fs.readFileSync(logFile, "utf8").split("\n").filter(Boolean);
  const timestampSet = new Set(timestamps);
  const updatedLines = lines.map((line) => {
    try {
      const log = JSON.parse(line);
      if (timestampSet.has(log.timestamp)) {
        log.synced = true;
        return JSON.stringify(log);
      }
      return line;
    } catch (err) {
      return line;
    }
  });
  fs.writeFileSync(logFile, updatedLines.join("\n") + "\n");
}

// Prune old logs
function pruneLogs(config) {
  ensureDirectories();
  const retentionMs = config.log_retention_hours * 60 * 60 * 1000;
  const cutoff = Date.now() - retentionMs;

  const files = fs.readdirSync(LOGS_DIR);
  let pruned = 0;

  for (const file of files) {
    if (!file.startsWith("jobs-") || !file.endsWith(".jsonl")) {
      continue;
    }

    const filePath = path.join(LOGS_DIR, file);
    const lines = fs.readFileSync(filePath, "utf8").split("\n").filter(Boolean);
    const keptLines = [];

    for (const line of lines) {
      try {
        const log = JSON.parse(line);
        const logTime = new Date(log.timestamp).getTime();
        // Keep if: not synced OR within retention period
        if (!log.synced || logTime > cutoff) {
          keptLines.push(line);
        } else {
          pruned++;
        }
      } catch (err) {
        // Keep invalid lines
        keptLines.push(line);
      }
    }

    if (keptLines.length === 0) {
      // Delete empty file
      fs.unlinkSync(filePath);
    } else {
      fs.writeFileSync(filePath, keptLines.join("\n") + "\n");
    }
  }

  return { pruned };
}

// Worker presence: POST a heartbeat to the hub each sync cycle so the
// dashboard shows live workers, not just workers that once pushed plugins.
async function sendHeartbeat(config) {
  const headers = { "Content-Type": "application/json" };
  if (process.env.SUPERCLI_API_KEY) headers["X-API-Key"] = process.env.SUPERCLI_API_KEY;
  const res = await fetch(`${config.server_url}/api/clients/heartbeat`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      client_id: getClientId(),
      hostname: os.hostname(),
      sc_version: CLI_VERSION,
    }),
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`heartbeat failed: HTTP ${res.status}`);
}

// Daemon main loop
let lastErrEmit = 0;
async function daemonMain() {
  const config = loadConfig();
  console.error("Daemon started, syncing every", config.sync_interval_seconds, "seconds");

  while (true) {
    try {
      writeHeartbeat();
      await sendHeartbeat(config);
      const syncResult = await syncLogs(config);
      const pruneResult = pruneLogs(config);

      if (syncResult.synced > 0 || pruneResult.pruned > 0) {
        console.error(`Synced ${syncResult.synced} logs, pruned ${pruneResult.pruned} logs`);
      }
    } catch (err) {
      console.error("Daemon error:", err);
      // error telemetry throttled <=1/h — a serve running for days with a bad
      // SUPERCLI_SERVER would otherwise flood the shared ledger.
      if (Date.now() - lastErrEmit >= 3600 * 1000) {
        lastErrEmit = Date.now();
        telemetry.record("error", 110);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, config.sync_interval_seconds * 1000));
  }
}

// This file is library-only — there is no CLI entry. The legacy
// 'node daemon.js --daemon' spawn path was removed; the only daemon
// entry is `sc daemon start` → detached `sc serve` (cli/serve.js).

module.exports = {
  startDaemon,
  stopDaemon,
  getDaemonStatus,
  writeLog,
  loadConfig,
  daemonMain,
};
