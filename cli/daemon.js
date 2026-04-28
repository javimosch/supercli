const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawn } = require("child_process");

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

// Load daemon configuration
function loadConfig() {
  ensureDirectories();
  if (!fs.existsSync(CONFIG_FILE)) {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(DEFAULT_CONFIG, null, 2));
    return DEFAULT_CONFIG;
  }
  try {
    return { ...DEFAULT_CONFIG, ...JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8")) };
  } catch (err) {
    return DEFAULT_CONFIG;
  }
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

// Check if daemon is running
function isDaemonRunning() {
  if (!fs.existsSync(PID_FILE)) {
    return false;
  }
  try {
    const pid = parseInt(fs.readFileSync(PID_FILE, "utf8").trim());
    // Check if process is running
    try {
      process.kill(pid, 0);
      return true;
    } catch (e) {
      // Process not found, clean up stale PID file
      fs.unlinkSync(PID_FILE);
      return false;
    }
  } catch (err) {
    return false;
  }
}

// Write heartbeat timestamp
function writeHeartbeat() {
  ensureDirectories();
  fs.writeFileSync(HEARTBEAT_FILE, new Date().toISOString());
}

// Get heartbeat timestamp
function getHeartbeat() {
  if (!fs.existsSync(HEARTBEAT_FILE)) {
    return null;
  }
  try {
    return new Date(fs.readFileSync(HEARTBEAT_FILE, "utf8").trim());
  } catch (err) {
    return null;
  }
}

// Start daemon process
function startDaemon() {
  ensureDirectories();
  if (isDaemonRunning()) {
    return { ok: true, message: "Daemon already running" };
  }

  const config = loadConfig();
  if (!config.enabled) {
    return { ok: false, message: "Daemon is disabled in config" };
  }

  // Spawn daemon as independent process
  const daemonScript = path.join(__dirname, "daemon.js");
  const nodePath = process.execPath;

  const child = spawn(nodePath, [daemonScript, "--daemon"], {
    detached: true,
    stdio: "ignore",
  });

  child.unref(); // Allow parent to exit without waiting for child

  return { ok: true, message: "Daemon started" };
}

// Stop daemon process
function stopDaemon() {
  if (!isDaemonRunning()) {
    return { ok: true, message: "Daemon not running" };
  }

  try {
    const pid = parseInt(fs.readFileSync(PID_FILE, "utf8").trim());
    process.kill(pid, "SIGTERM");
    fs.unlinkSync(PID_FILE);
    return { ok: true, message: "Daemon stopped" };
  } catch (err) {
    return { ok: false, message: `Failed to stop daemon: ${err.message}` };
  }
}

// Get daemon status
function getDaemonStatus() {
  const running = isDaemonRunning();
  const heartbeat = getHeartbeat();
  const config = loadConfig();

  return {
    running,
    enabled: config.enabled,
    heartbeat: heartbeat ? heartbeat.toISOString() : null,
    pid: running ? parseInt(fs.readFileSync(PID_FILE, "utf8").trim()) : null,
  };
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

// Daemon main loop
async function daemonMain() {
  const config = loadConfig();
  console.log("Daemon started, syncing every", config.sync_interval_seconds, "seconds");

  while (true) {
    try {
      writeHeartbeat();
      const syncResult = await syncLogs(config);
      const pruneResult = pruneLogs(config);

      if (syncResult.synced > 0 || pruneResult.pruned > 0) {
        console.log(`Synced ${syncResult.synced} logs, pruned ${pruneResult.pruned} logs`);
      }
    } catch (err) {
      console.error("Daemon error:", err);
    }

    await new Promise((resolve) => setTimeout(resolve, config.sync_interval_seconds * 1000));
  }
}

// CLI entry point
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes("--daemon")) {
    // Run as daemon process
    const pid = process.pid;
    ensureDirectories();
    fs.writeFileSync(PID_FILE, pid.toString());
    daemonMain().catch((err) => {
      console.error("Daemon fatal error:", err);
      process.exit(1);
    });
  } else {
    // CLI commands
    const command = args[0];

    switch (command) {
      case "start":
        console.log(JSON.stringify(startDaemon(), null, 2));
        break;
      case "stop":
        console.log(JSON.stringify(stopDaemon(), null, 2));
        break;
      case "status":
        console.log(JSON.stringify(getDaemonStatus(), null, 2));
        break;
      default:
        console.log("Usage: node daemon.js {start|stop|status}");
        process.exit(1);
    }
  }
}

module.exports = {
  startDaemon,
  stopDaemon,
  isDaemonRunning,
  writeLog,
  syncLogs,
  pruneLogs,
  writeHeartbeat,
  getHeartbeat,
  getDaemonStatus,
  loadConfig,
};
