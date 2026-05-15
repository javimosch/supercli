#!/usr/bin/env node
// Check goose-skills provider registration status
const { spawnSync } = require("child_process");
const path = require("path");

const supercli = path.resolve(__dirname, "..", "..", "..", "cli", "supercli.js");
const result = spawnSync("node", [supercli, "skills", "providers", "list", "--json"], {
  encoding: "utf-8",
  timeout: 15000
});

if (result.error || result.status !== 0) {
  console.log("Goose Skills provider not registered. Run 'sc goose-skills self setup'");
  process.exit(0);
}

try {
  const data = JSON.parse(result.stdout);
  const providers = Array.isArray(data.providers) ? data.providers : [];
  const goose = providers.find(p => p.name === "goose-skills");
  if (goose) {
    console.log("Goose Skills provider registered.");
    console.log("Run 'sc skills search <query> --provider goose-skills' to find skills.");
  } else {
    console.log("Goose Skills provider not registered. Run 'sc goose-skills self setup'");
  }
} catch {
  console.log("Goose Skills provider not registered. Run 'sc goose-skills self setup'");
}
