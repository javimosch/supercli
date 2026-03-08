const fs = require("fs")
const path = require("path")
const os = require("os")
const { getInstalledPluginCommands, listInstalledPlugins } = require("./plugins-store")

const CACHE_DIR = path.join(os.homedir(), ".supercli")
const CACHE_FILE = path.join(CACHE_DIR, "config.json")

function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true })
  }
}

function readCache() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, "utf-8")
      return JSON.parse(raw)
    }
  } catch (e) {
    // Corrupted cache, ignore
  }
  return null
}

function writeCache(config) {
  ensureCacheDir()
  const data = {
    ...config,
    fetchedAt: Date.now()
  }
  fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2))
  return data
}

async function fetchRemoteConfig(server) {
  if (!server) throw new Error("SUPERCLI_SERVER is not configured")
  const url = `${server}/api/config`
  const r = await fetch(url)
  if (!r.ok) throw new Error(`Failed to fetch config: ${r.status} ${r.statusText}`)
  return r.json()
}

function emptyConfig() {
  return {
    version: "1",
    ttl: 3600,
    mcp_servers: [],
    specs: [],
    commands: []
  }
}

async function loadConfig() {
  const cache = readCache()
  const base = cache || emptyConfig()
  const pluginCommands = getInstalledPluginCommands()
  const merged = {
    ...base,
    commands: [...(base.commands || []), ...pluginCommands]
  }
  return merged
}

async function syncConfig(server) {
  const config = await fetchRemoteConfig(server)

  if (!Array.isArray(config.mcp_servers)) {
    try {
      const mcpRes = await fetch(`${server}/api/mcp?format=json`)
      config.mcp_servers = mcpRes.ok ? await mcpRes.json() : []
    } catch {
      config.mcp_servers = []
    }
  }

  if (!Array.isArray(config.specs)) {
    try {
      const specsRes = await fetch(`${server}/api/specs?format=json`)
      config.specs = specsRes.ok ? await specsRes.json() : []
    } catch {
      config.specs = []
    }
  }

  if (!Array.isArray(config.commands)) config.commands = []
  return writeCache(config)
}

async function setMcpServer(name, url) {
  const cfg = readCache() || emptyConfig()
  const servers = Array.isArray(cfg.mcp_servers) ? cfg.mcp_servers.slice() : []
  const idx = servers.findIndex(s => s && s.name === name)
  const next = { name, url }
  if (idx >= 0) servers[idx] = next
  else servers.push(next)
  cfg.mcp_servers = servers
    .filter(s => s && typeof s.name === "string")
    .sort((a, b) => a.name.localeCompare(b.name))
  return writeCache(cfg)
}

async function removeMcpServer(name) {
  const cfg = readCache() || emptyConfig()
  const servers = Array.isArray(cfg.mcp_servers) ? cfg.mcp_servers : []
  const next = servers.filter(s => s && s.name !== name)
  const removed = next.length !== servers.length
  cfg.mcp_servers = next
  writeCache(cfg)
  return removed
}

async function listMcpServers() {
  const cfg = await loadConfig()
  return Array.isArray(cfg.mcp_servers) ? cfg.mcp_servers : []
}

async function showConfig() {
  const cache = readCache()
  if (!cache) {
    return { cached: false, message: "No config cached. Set SUPERCLI_SERVER and run: supercli sync" }
  }
  return {
    version: cache.version,
    ttl: cache.ttl,
    fetchedAt: new Date(cache.fetchedAt).toISOString(),
    commands: cache.commands ? cache.commands.length : 0,
    plugins: listInstalledPlugins().length,
    mcp_servers: cache.mcp_servers ? cache.mcp_servers.length : 0,
    specs: cache.specs ? cache.specs.length : 0,
    cacheFile: CACHE_FILE
  }
}

module.exports = { loadConfig, syncConfig, showConfig, setMcpServer, removeMcpServer, listMcpServers }
