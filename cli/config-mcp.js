"use strict";

const {
  readCache,
  writeCache,
  emptyConfig,
  normalizeMcpServerEntry,
  normalizeMcpServers,
  loadConfig,
} = require("./config-core");

async function setMcpServer(name, value) {
  const cfg = readCache() || emptyConfig();
  const servers = Array.isArray(cfg.mcp_servers) ? cfg.mcp_servers.slice() : [];
  const idx = servers.findIndex(s => s && s.name === name);
  const incoming = typeof value === "string" ? { url: value } : (value && typeof value === "object" ? value : {});
  const next = normalizeMcpServerEntry(name, { name, ...incoming });
  if (!next) {
    throw Object.assign(new Error("Invalid MCP server definition"), {
      code: 85,
      type: "invalid_argument",
      recoverable: false,
    });
  }
  if (idx >= 0) servers[idx] = next;
  else servers.push(next);
  cfg.mcp_servers = normalizeMcpServers({ mcp_servers: servers });
  return writeCache(cfg);
}

async function removeMcpServer(name) {
  const cfg = readCache() || emptyConfig();
  const servers = Array.isArray(cfg.mcp_servers) ? cfg.mcp_servers : [];
  const next = servers.filter(s => s && s.name !== name);
  const removed = next.length !== servers.length;
  cfg.mcp_servers = next;
  writeCache(cfg);
  return removed;
}

async function listMcpServers() {
  const cfg = await loadConfig();
  return Array.isArray(cfg.mcp_servers) ? cfg.mcp_servers : [];
}

module.exports = {
  setMcpServer,
  removeMcpServer,
  listMcpServers,
  normalizeMcpServerEntry,
  normalizeMcpServers,
};
