#!/usr/bin/env node
// Sync goose-skills catalog
const { spawnSync } = require("child_process");
const path = require("path");

const supercli = path.resolve(__dirname, "..", "..", "..", "cli", "supercli.js");
const result = spawnSync("node", [supercli, "skills", "sync"], {
  encoding: "utf-8", timeout: 60000
});

if (result.error || result.status !== 0) {
  console.error("Sync failed:", (result.stderr || "").trim());
  process.exit(1);
}
console.log("Goose Skills catalog synced.");
