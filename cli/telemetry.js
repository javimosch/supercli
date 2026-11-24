"use strict";
// telemetry — cli-telemetry-spec, shared consolidation ledger.
//
// One event per invocation is appended to ~/.supercli/telemetry.jsonl
// (shared with sc-machin and sc-zig). At most once per hour, pending
// lines are flushed as a single JSON-array POST to grange.intrane.fr/t.
// The flush runs in a detached child process so the CLI never waits on
// the network. Opt-outs: SUPERCLI_TELEMETRY=0|off|false|no,
// DO_NOT_TRACK=1, `sc telemetry --off`, or any CI environment.

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");

const DIR = path.join(os.homedir(), ".supercli");
const LEDGER = path.join(DIR, "telemetry.jsonl");
const FLUSH_TS = path.join(DIR, "telemetry-flush.ts");
const OFF_FILE = path.join(DIR, "telemetry-off");
const NOTICE_FILE = path.join(DIR, "telemetry-notice-shown");
const INSTALL_FILE = path.join(DIR, "telemetry-install-sent");
const ENDPOINT_DEFAULT = "https://grange.intrane.fr/t";
const FLUSH_INTERVAL_MS = 3600 * 1000;
const MAX_BATCH = 200;
const TRIM_LINES = 1000;
const TRIM_KEEP = 500;

let currentVerb = "none";
let hooked = false;

function endpoint() {
  return process.env.SUPERCLI_TELEMETRY_URL || ENDPOINT_DEFAULT;
}

function offReason() {
  const v = (process.env.SUPERCLI_TELEMETRY || "").toLowerCase();
  if (v === "0" || v === "off" || v === "false" || v === "no") return "SUPERCLI_TELEMETRY=off";
  if (process.env.DO_NOT_TRACK === "1") return "DO_NOT_TRACK=1";
  try { if (fs.existsSync(OFF_FILE)) return "disabled via `sc telemetry --off`"; } catch (e) {}
  for (const k of ["CI", "CONTINUOUS_INTEGRATION", "GITHUB_ACTIONS", "GITLAB_CI", "BUILDKITE"]) {
    if (process.env[k]) return `${k} (CI)`;
  }
  return "";
}

function enabled() { return offReason() === ""; }

function exitClass(code) {
  const c = Number(code) || 0;
  if (c === 0) return 0;
  if (c >= 80 && c < 90) return 80;
  if (c >= 90 && c < 100) return 90;
  if (c >= 100 && c < 110) return 100;
  return 110;
}

function eventJson(event, code) {
  const { CLI_VERSION } = require("./arg-parser");
  return {
    tool: "sc",
    version: CLI_VERSION,
    event,
    verb: currentVerb,
    os: process.platform,
    arch: process.arch === "x64" ? "x86_64" : process.arch,
    exit_class: exitClass(code),
    ts: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
  };
}

function maybeNotice() {
  try {
    if (fs.existsSync(NOTICE_FILE)) return;
    fs.mkdirSync(DIR, { recursive: true });
    fs.writeFileSync(NOTICE_FILE, String(Math.floor(Date.now() / 1000)));
    if (enabled()) {
      process.stderr.write(
        "supercli collects anonymous usage telemetry (tool, version, event, verb, os, arch, exit_class, ts).\n" +
        "It consolidates locally and sends at most once per hour. Inspect: `sc telemetry`. " +
        "Disable: `sc telemetry --off`, SUPERCLI_TELEMETRY=0, or DO_NOT_TRACK=1.\n"
      );
    }
  } catch (e) {}
}

function maybeInstall() {
  try {
    if (fs.existsSync(INSTALL_FILE)) return;
    fs.mkdirSync(DIR, { recursive: true });
    fs.writeFileSync(INSTALL_FILE, String(Math.floor(Date.now() / 1000)));
    if (enabled()) postBatch([eventJson("install", 0)]);
  } catch (e) {}
}

function record(event, code) {
  if (!enabled()) return;
  try {
    fs.mkdirSync(DIR, { recursive: true });
    fs.appendFileSync(LEDGER, JSON.stringify(eventJson(event, code)) + "\n");
  } catch (e) {}
}

// Gate: returns true if a flush attempt is due (and stamps the attempt).
// Stamping on attempt — not on success — bounds retries to <=1/h during outages.
function flushDue() {
  try {
    const st = fs.statSync(FLUSH_TS);
    if (Date.now() - st.mtimeMs < FLUSH_INTERVAL_MS) return false;
  } catch (e) {}
  try {
    fs.mkdirSync(DIR, { recursive: true });
    fs.writeFileSync(FLUSH_TS, String(Math.floor(Date.now() / 1000)));
  } catch (e) { return false; }
  try { return fs.statSync(LEDGER).size > 0; } catch (e) { return false; }
}

function spawnFlush() {
  try {
    const child = spawn(process.execPath, [__filename, "--flush"], {
      detached: true, stdio: "ignore",
      env: { ...process.env },
    });
    child.unref();
  } catch (e) {}
}

// Runs in the detached child: post all pending lines as one JSON array.
async function flushNow() {
  let raw;
  try { raw = fs.readFileSync(LEDGER, "utf8"); } catch (e) { return; }
  let lines = raw.split("\n").filter((l) => l.trim().length > 0);
  if (lines.length === 0) return;
  let oversize = false;
  if (lines.length > TRIM_LINES) { lines = lines.slice(-TRIM_KEEP); oversize = true; }
  const ok = await postBatch(lines.map((l) => JSON.parse(l)));
  if (ok) {
    try { fs.writeFileSync(LEDGER, oversize ? lines.map((l) => l + "\n").join("") : ""); } catch (e) {}
  }
}

async function postBatch(events) {
  const batch = events.slice(-MAX_BATCH);
  try {
    const res = await fetch(endpoint(), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: batch.length === 1 ? JSON.stringify(batch[0]) : JSON.stringify(batch),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return false;
    const body = await res.json().catch(() => null);
    return !!(body && body.ok === true);
  } catch (e) {
    return false;
  }
}

// Called once at the top of main(); registers the exit hook.
function init(verb) {
  currentVerb = verb || "none";
  if (hooked) return;
  hooked = true;
  maybeNotice();
  maybeInstall();
  process.on("exit", (code) => {
    // Spec steady-state exits are successes, not errors: 3 = daemon stopped,
    // 5 = update available. Recording them as errors would corrupt the error KPI.
    const steady = code === 0 || code === 3 || code === 5;
    record(steady ? "run" : "error", steady ? 0 : code);
    if (flushDue()) spawnFlush();
  });
}

function pendingCount() {
  try {
    return fs.readFileSync(LEDGER, "utf8").split("\n").filter((l) => l.trim()).length;
  } catch (e) { return 0; }
}

function cmdTelemetry(off) {
  if (off) {
    fs.mkdirSync(DIR, { recursive: true });
    fs.writeFileSync(OFF_FILE, String(Math.floor(Date.now() / 1000)));
  }
  const reason = offReason();
  const sample = eventJson("run", 0);
  return {
    enabled: reason === "",
    reason: reason || "enabled",
    endpoint: endpoint(),
    consolidation: "local ledger, flushed at most once per hour",
    pending_events: pendingCount(),
    fields: Object.keys(sample),
    next_payload: sample,
    opt_out: ["sc telemetry --off", "SUPERCLI_TELEMETRY=0", "DO_NOT_TRACK=1"],
    note: "no arguments, paths, hosts, or identity are collected",
  };
}

if (require.main === module && process.argv.includes("--flush")) {
  flushNow().then(() => process.exit(0)).catch(() => process.exit(0));
}

module.exports = { init, cmdTelemetry, enabled, offReason, record };
