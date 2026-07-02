"use strict";

const CLI_VERSION = "1.31.5";

const RESERVED_FLAGS = [
  "human", "json", "compact", "schema", "help-json", "help",
  "version", "no-color", "show-dag", "format", "on-conflict",
];

function parseArgs(argv) {
  const flags = {};
  const positional = [];
  let endOfOptions = false;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith("--") && !endOfOptions) {
      const kv = arg.slice(2);
      if (kv === "") { endOfOptions = true; continue; }
      const eqIdx = kv.indexOf("=");
      if (eqIdx !== -1) {
        const key = kv.slice(0, eqIdx);
        if (key === "") continue;
        flags[key] = kv.slice(eqIdx + 1);
      } else if (i + 1 < argv.length && !argv[i + 1].startsWith("--")) {
        flags[kv] = argv[++i];
      } else {
        flags[kv] = true;
      }
    } else {
      positional.push(arg);
    }
  }
  return { flags, positional, rawArgs: argv };
}

function userFlags(flags) {
  const f = {};
  for (const [k, v] of Object.entries(flags)) {
    if (!RESERVED_FLAGS.includes(k)) f[k] = v;
  }
  return f;
}

async function readStdin() {
  if (process.stdin.isTTY) return null;
  return new Promise((resolve) => {
    let data = "";
    let resolved = false;
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (chunk) => { data += chunk; });
    process.stdin.on("end", () => {
      if (resolved) return;
      resolved = true;
      if (!data.trim()) return resolve(null);
      try { resolve(JSON.parse(data)); } catch { resolve({ _stdin: data.trim() }); }
    });
    process.stdin.on("error", () => { if (!resolved) { resolved = true; resolve(null); } });
    setTimeout(() => {
      if (!resolved) { resolved = true; process.stdin.destroy(); resolve(null); }
    }, 50);
  });
}

module.exports = { CLI_VERSION, RESERVED_FLAGS, parseArgs, userFlags, readStdin };
