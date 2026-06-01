// config.js — Router re-exporting config sub-modules
const core = require("./config-core");
const mcp = require("./config-mcp");
const sync = require("./config-sync");
const commands = require("./config-commands");

module.exports = {
  // Core
  ...core,
  // MCP
  setMcpServer: mcp.setMcpServer,
  removeMcpServer: mcp.removeMcpServer,
  listMcpServers: mcp.listMcpServers,
  // Sync
  syncConfig: sync.syncConfig,
  syncClientPluginResources: sync.syncClientPluginResources,
  // Commands
  upsertCommand: commands.upsertCommand,
  removeCommandsByNamespace: commands.removeCommandsByNamespace,
  showConfig: commands.showConfig,
};