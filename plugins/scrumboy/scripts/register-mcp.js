#!/usr/bin/env node
// Register scrumboy MCP server with supercli/opencode
const fs = require("fs");
const path = require("path");
const os = require("os");

const PORT = process.env.SCRUMBOY_PORT || "8080";
const HOST = process.env.SCRUMBOY_HOST || "http://localhost";

const configDir = process.env.SUPERCLI_HOME || path.join(os.homedir(), ".supercli");
const mcpFile = path.join(configDir, "mcp.json");

const serverConfig = {
  name: "scrumboy",
  url: `${HOST}:${PORT}/mcp/rpc`,
  timeout_ms: 30000,
  description: "Scrumboy kanban/project management MCP server",
};

// Ensure config dir exists
fs.mkdirSync(configDir, { recursive: true });

// Read existing or create new
let existing = { mcp_servers: [] };
try {
  existing = JSON.parse(fs.readFileSync(mcpFile, "utf-8"));
} catch {
  // File doesn't exist yet
}

// Add or update scrumboy entry
const idx = existing.mcp_servers.findIndex((s) => s.name === "scrumboy");
if (idx >= 0) {
  existing.mcp_servers[idx] = { ...existing.mcp_servers[idx], ...serverConfig };
  console.log("Updated existing scrumboy MCP server config");
} else {
  existing.mcp_servers.push(serverConfig);
  console.log("Added scrumboy MCP server config");
}

fs.writeFileSync(mcpFile, JSON.stringify(existing, null, 2));
console.log(`MCP config written to ${mcpFile}`);
