#!/usr/bin/env node
// Register goose-skills remote_repo provider and sync
const { spawnSync } = require("child_process");
const path = require("path");

const supercli = path.resolve(__dirname, "..", "..", "..", "cli", "supercli.js");

// Step 1: Add provider
const addResult = spawnSync("node", [supercli, "skills", "providers", "add",
  "--name", "goose-skills",
  "--type", "remote_repo",
  "--source-repo", "https://github.com/gooseworks-ai/goose-skills",
  "--root", "skills",
  "--ref", "main"
], { encoding: "utf-8", timeout: 15000 });

if (addResult.error || addResult.status !== 0) {
  console.error("Failed to add provider:", (addResult.stderr || "").trim());
  process.exit(1);
}
console.log("Provider registered.");

// Step 2: Sync
const syncResult = spawnSync("node", [supercli, "skills", "sync"], {
  encoding: "utf-8", timeout: 60000
});

if (syncResult.error || syncResult.status !== 0) {
  console.error("Sync failed:", (syncResult.stderr || "").trim());
  process.exit(1);
}

try {
  const data = JSON.parse(syncResult.stdout);
  const count = Array.isArray(data.skills) ? data.skills.length : (data.skills || 0);
  console.log(`Synced. Total skills in catalog: ${data.skills || data.providers ? data.providers.length : '?'}`);
} catch {
  console.log("Sync completed.");
}
console.log("Done. Run 'sc skills search <query> --provider goose-skills' to find skills.");
