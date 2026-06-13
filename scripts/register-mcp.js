#!/usr/bin/env node
"use strict"

/**
 * Register an MCP stdio server with supercli.
 *
 * This script adds or updates an MCP server configuration in the user's
 * supercli config directory. It reads the existing mcp.json file, merges
 * the new server configuration, and writes it back.
 *
 * Usage: node scripts/register-mcp.js <name> <command> [args_json] [description]
 *
 * @module register-mcp
 */

const fs = require("fs");
const path = require("path");
const os = require("os");

/**
 * Command-line arguments:
 * - name: MCP server name (required)
 * - command: Command to start the MCP server (required)
 * - argsJson: JSON array of command arguments (optional, defaults to "[]")
 * - description: Server description (optional, defaults to "<name> MCP server")
 */
const name = process.argv[2];
const command = process.argv[3];
const argsJson = process.argv[4] || "[]";
const description = process.argv[5] || `${name} MCP server`;

const configDir = process.env.SUPERCLI_HOME || path.join(os.homedir(), ".supercli");
const mcpFile = path.join(configDir, "mcp.json");

/**
 * Server configuration object to be added or updated.
 */
const serverConfig = {
  name,
  command,
  args: JSON.parse(argsJson),
  timeout_ms: 60000,
  description,
};

/**
 * Ensure the supercli config directory exists.
 */
fs.mkdirSync(configDir, { recursive: true });

/**
 * Read existing MCP configuration, or start with empty config if file doesn't exist.
 */
let existing = { mcp_servers: [] };
try {
  existing = JSON.parse(fs.readFileSync(mcpFile, "utf-8"));
} catch (err) {
  // File doesn't exist or invalid JSON, start fresh
  if (err.code !== 'ENOENT') {
    console.warn(`Warning: Could not parse ${mcpFile}: ${err.message}. Starting fresh.`);
  }
}

/**
 * Update existing server config if found, otherwise add new entry.
 */
const idx = existing.mcp_servers.findIndex((s) => s.name === name);
if (idx >= 0) {
  existing.mcp_servers[idx] = { ...existing.mcp_servers[idx], ...serverConfig };
  console.log(`Updated ${name} MCP server config`);
} else {
  existing.mcp_servers.push(serverConfig);
  console.log(`Added ${name} MCP server config`);
}

/**
 * Write the updated MCP configuration back to the file.
 */
fs.writeFileSync(mcpFile, JSON.stringify(existing, null, 2));
console.log(`MCP config written to ${mcpFile}`);
