#!/usr/bin/env node
// witr wrapper: run witr, capture output, always exit 0
// This works around witr's exit code 1 for warnings / running as root
const { spawnSync } = require("child_process");
const args = process.argv.slice(2);
const result = spawnSync("witr", args, { stdio: ["ignore", "pipe", "pipe"], encoding: "utf-8" });
if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
process.exit(0);
