// selfupdate — cli-update-spec for the npm-distributed sc.
// sc installs via `npm i -g superacli`, so "update" means asking the npm
// registry for the latest published version and shelling out to npm.
// The version endpoint IS the registry — documented deviation from the
// spec's committed-file endpoint (npm is the release channel).
// Nudge: ~/.supercli/update-cache-sc.json refreshed detached <=1/h, one
// stderr line per new version. SUPERCLI_NO_NUDGE=1 disables.

const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawn, execSync } = require("child_process");
const { CLI_VERSION } = require("./arg-parser");

const PKG = "superacli";
const REGISTRY_URL = process.env.SUPERCLI_UPDATE_URL ||
  `https://registry.npmjs.org/${PKG}/latest`;
const CACHE = path.join(os.homedir(), ".supercli", "update-cache-sc.json");
const NUDGED = path.join(os.homedir(), ".supercli", "update-sc-nudged");

const NUDGE_SKIP = new Set([
  "update", "install", "uninstall", "version", "help", "help-json",
  "guide", "telemetry", "feedback", "_update-refresh",
]);

function output(obj) { console.log(JSON.stringify(obj)); }

function outputError(code, type, message, recoverable) {
  output({ error: { code, type, message, recoverable, suggestions: [] } });
  process.exit(code);
}

async function fetchLatest() {
  try {
    const res = await fetch(REGISTRY_URL, {
      signal: AbortSignal.timeout(8000),
      headers: { accept: "application/json" },
    });
    if (!res.ok) return null;
    const body = await res.json();
    return typeof body.version === "string" && body.version ? body.version : null;
  } catch {
    return null;
  }
}

// hidden internal verb: detached worker that refreshes the cache
async function refreshCache() {
  const latest = await fetchLatest();
  if (!latest) return;
  fs.mkdirSync(path.dirname(CACHE), { recursive: true });
  fs.writeFileSync(CACHE + ".tmp", JSON.stringify({ version: latest }));
  fs.renameSync(CACHE + ".tmp", CACHE);
}

function maybeSpawnRefresh() {
  let stale = true;
  try {
    stale = Date.now() - fs.statSync(CACHE).mtimeMs >= 3600_000;
  } catch { /* no cache */ }
  if (!stale) return;
  const child = spawn(process.execPath, [__filename, "_update-refresh"], {
    detached: true,
    stdio: "ignore",
    env: process.env,
  });
  child.unref();
}

// Called once per invocation before dispatch — must stay cheap:
// one stat + (when a newer version is cached) the nudge print.
function nudge(verb) {
  if (NUDGE_SKIP.has(verb)) return;
  if (process.env.SUPERCLI_NO_NUDGE) return;
  maybeSpawnRefresh();
  let remote;
  try {
    remote = JSON.parse(fs.readFileSync(CACHE, "utf8")).version;
  } catch {
    return;
  }
  if (!remote || remote === CLI_VERSION) return;
  let already;
  try {
    already = fs.readFileSync(NUDGED, "utf8").trim();
  } catch { /* first nudge */ }
  if (already === remote) return;
  fs.mkdirSync(path.dirname(NUDGED), { recursive: true });
  fs.writeFileSync(NUDGED, remote);
  process.stderr.write(
    `[update] a newer sc is available (${CLI_VERSION} -> ${remote}). Run: sc update\n`
  );
}

function semverLt(a, b) {
  const pa = a.split(".").map(Number), pb = b.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) < (pb[i] || 0);
  }
  return false;
}

async function handleUpdate(flags) {
  const check = !!flags.check;
  const force = !!flags.force;
  const latest = await fetchLatest();
  if (!latest) {
    outputError(100, "external_failure", "npm registry unreachable", true);
  }
  const newer = semverLt(CLI_VERSION, latest);

  if (!force && !newer) {
    output({ ok: true, data: { up_to_date: true, version: CLI_VERSION } });
    process.exit(0);
  }
  if (check) {
    output({
      ok: true,
      data: {
        up_to_date: false,
        current: CLI_VERSION,
        available: latest,
        update_via: `npm install -g ${PKG}@latest`,
      },
    });
    process.exit(5);
  }
  // npm does the swap — spawn it inheriting stdio so progress/errors show
  const res = spawn("npm", ["install", "-g", `${PKG}@latest`], {
    stdio: "inherit",
  });
  res.on("exit", (code) => {
    if (code === 0) {
      output({ ok: true, data: { updated: true, previous: CLI_VERSION, version: latest } });
    } else {
      outputError(90, "permission", `npm install -g exited ${code} (need sudo? check npm prefix)`, false);
    }
  });
}

module.exports = { nudge, handleUpdate, refreshCache };

if (require.main === module && process.argv[2] === "_update-refresh") {
  refreshCache().then(() => process.exit(0)).catch(() => process.exit(1));
}
