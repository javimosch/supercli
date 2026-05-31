#!/usr/bin/env node
// Register an MCP stdio server with supercli
const fs = require("fs");
const path = require("path");
const os = require("os");

const name = process.argv[2];
const command = process.argv[3];
const argsJson = process.argv[4] || "[]";
const description = process.argv[5] || `${name} MCP server`;

const configDir = process.env.SUPERCLI_HOME || path.join(os.homedir(), ".supercli");
const mcpFile = path.join(configDir, "mcp.json");

const serverConfig = {
  name,
  command,
  args: JSON.parse(argsJson),
  timeout_ms: 60000,
  description,
};

fs.mkdirSync(configDir, { recursive: true });

let existing = { mcp_servers: [] };
try {
  existing = JSON.parse(fs.readFileSync(mcpFile, "utf-8"));
} catch (err) {
  // File doesn't exist or invalid JSON, start fresh
  if (err.code !== 'ENOENT') {
    console.warn(`Warning: Could not parse ${mcpFile}: ${err.message}. Starting fresh.`);
  }
}

const idx = existing.mcp_servers.findIndex((s) => s.name === name);
if (idx >= 0) {
  existing.mcp_servers[idx] = { ...existing.mcp_servers[idx], ...serverConfig };
  console.log(`Updated ${name} MCP server config`);
} else {
  existing.mcp_servers.push(serverConfig);
  console.log(`Added ${name} MCP server config`);
}

fs.writeFileSync(mcpFile, JSON.stringify(existing, null, 2));
console.log(`MCP config written to ${mcpFile}`);
