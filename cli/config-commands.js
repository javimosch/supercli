"use strict";

const {
  readCache,
  writeCache,
  emptyConfig,
} = require("./config-core");
const {
  listInstalledPlugins,
  readServerPluginsLock,
} = require("./plugins-store");

async function upsertCommand(commandDef) {
  const cfg = readCache() || emptyConfig();
  const commands = Array.isArray(cfg.commands) ? cfg.commands.slice() : [];
  const idx = commands.findIndex(c =>
    c && c.namespace === commandDef.namespace && c.resource === commandDef.resource && c.action === commandDef.action,
  );
  if (idx >= 0) commands[idx] = commandDef;
  else commands.push(commandDef);
  cfg.commands = commands;
  writeCache(cfg);
  return commandDef;
}

async function removeCommandsByNamespace(namespace) {
  const cfg = readCache() || emptyConfig();
  const commands = Array.isArray(cfg.commands) ? cfg.commands : [];
  const next = commands.filter(c => !(c && c.namespace === namespace));
  const removed = commands.length - next.length;
  cfg.commands = next;
  writeCache(cfg);
  return removed;
}

async function showConfig() {
  const cache = readCache();
  if (!cache) {
    return { cached: false, message: "No config cached. Set SUPERCLI_SERVER and run: supercli sync" };
  }
  return {
    version: cache.version,
    ttl: cache.ttl,
    fetchedAt: new Date(cache.fetchedAt).toISOString(),
    commands: cache.commands ? cache.commands.length : 0,
    plugins: listInstalledPlugins().length,
    server_plugins: Object.keys((readServerPluginsLock().installed || {})).length,
    mcp_servers: cache.mcp_servers ? cache.mcp_servers.length : 0,
    specs: cache.specs ? cache.specs.length : 0,
  };
}

module.exports = {
  upsertCommand,
  removeCommandsByNamespace,
  showConfig,
};
