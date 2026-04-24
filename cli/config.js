const fs = require("fs")
const path = require("path")
const os = require("os")
const {
  getEffectivePluginCommands,
  listInstalledPlugins,
  readServerPluginsLock,
  writeServerPluginsLock,
  SUPERCLI_PLUGINS_DIR,
} = require("./plugins-store")
const { spawnSync } = require("child_process")

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
      const parsed = JSON.parse(raw)
      return normalizeConfig(parsed)
    }
  } catch (e) {
    // Corrupted cache, ignore
  }
  return null
}

function normalizeMcpServerEntry(name, entry) {
  if (!name || typeof name !== "string") return null
  if (!entry || typeof entry !== "object" || Array.isArray(entry)) return null
  const out = { name }
  if (typeof entry.url === "string") out.url = entry.url
  if (typeof entry.command === "string") out.command = entry.command
  if (Array.isArray(entry.args)) out.args = entry.args.filter(v => typeof v === "string")
  if (Array.isArray(entry.commandArgs)) out.commandArgs = entry.commandArgs.filter(v => typeof v === "string")
  if (entry.headers && typeof entry.headers === "object" && !Array.isArray(entry.headers)) {
    out.headers = Object.fromEntries(Object.entries(entry.headers).filter(([k, v]) => typeof k === "string" && typeof v === "string"))
  }
  if (entry.env && typeof entry.env === "object" && !Array.isArray(entry.env)) {
    out.env = Object.fromEntries(Object.entries(entry.env).filter(([k, v]) => typeof k === "string" && typeof v === "string"))
  }
  if (typeof entry.timeout_ms === "number" && entry.timeout_ms > 0) out.timeout_ms = entry.timeout_ms
  if (entry.stateful === true) out.stateful = true
  return out
}

function normalizeMcpServers(config) {
  const out = []
  const byName = new Map()

  if (config && config.mcpServers && typeof config.mcpServers === "object" && !Array.isArray(config.mcpServers)) {
    for (const [name, value] of Object.entries(config.mcpServers)) {
      const normalized = normalizeMcpServerEntry(name, value)
      if (normalized) byName.set(name, normalized)
    }
  }

  if (Array.isArray(config && config.mcp_servers)) {
    for (const entry of config.mcp_servers) {
      if (!entry || typeof entry !== "object") continue
      const normalized = normalizeMcpServerEntry(entry.name, entry)
      if (normalized) byName.set(normalized.name, normalized)
    }
  }

  for (const value of byName.values()) out.push(value)
  out.sort((a, b) => a.name.localeCompare(b.name))
  return out
}

function normalizeConfig(config) {
  const base = config && typeof config === "object" ? { ...config } : emptyConfig()
  base.mcp_servers = normalizeMcpServers(base)
  if (!Array.isArray(base.specs)) base.specs = []
  if (!Array.isArray(base.commands)) base.commands = []
  return base
}

function writeCache(config) {
  ensureCacheDir()
  const data = {
    ...normalizeConfig(config),
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
  const pluginCommands = getEffectivePluginCommands()
  const merged = {
    ...base,
    commands: [...(base.commands || []), ...pluginCommands]
  }
  return merged
}

function safePluginName(name) {
  return String(name || "").replace(/[^a-zA-Z0-9._-]/g, "-")
}

function safePluginVersion(version) {
  const value = String(version || "0.0.0").replace(/[^a-zA-Z0-9._-]/g, "-")
  return value || "0.0.0"
}

function resolveHooksPolicy(plugin, settings) {
  const pluginPolicy = String(plugin.hooks_policy || "inherit")
  if (pluginPolicy === "allow" || pluginPolicy === "deny") return pluginPolicy
  return String(settings.default_hooks_policy || "deny")
}

function runServerPluginPostInstall(pluginDir, plugin, hookPolicy) {
  const manifest = plugin.manifest || {}
  if (!manifest.post_install || hookPolicy !== "allow") {
    return { policy: hookPolicy, executed: false, reason: hookPolicy !== "allow" ? "policy_denied" : "hook_missing" }
  }
  if (manifest.post_install.runtime && manifest.post_install.runtime !== "node") {
    return { policy: hookPolicy, executed: false, reason: "unsupported_runtime" }
  }
  const scriptRel = String(manifest.post_install.script || "")
  if (!scriptRel) return { policy: hookPolicy, executed: false, reason: "hook_missing" }
  const scriptPath = path.resolve(pluginDir, scriptRel)
  const normalizedBase = path.resolve(pluginDir) + path.sep
  if (!scriptPath.startsWith(normalizedBase) || !fs.existsSync(scriptPath)) {
    return { policy: hookPolicy, executed: false, reason: "script_not_found" }
  }
  const timeoutMs = Number(manifest.post_install.timeout_ms)
  const resolvedTimeout = Number.isFinite(timeoutMs) && timeoutMs > 0 ? Math.min(timeoutMs, 15000) : 15000
  const result = spawnSync("node", [scriptPath], {
    encoding: "utf-8",
    timeout: resolvedTimeout,
    env: {
      ...process.env,
      SUPERCLI_PLUGIN_NAME: plugin.name,
      SUPERCLI_PLUGIN_DIR: pluginDir,
    },
  })
  if (result.error) {
    return { policy: hookPolicy, executed: true, ok: false, error: result.error.message }
  }
  if (result.status !== 0) {
    return {
      policy: hookPolicy,
      executed: true,
      ok: false,
      error: (result.stderr || "").trim() || `exit ${result.status}`,
    }
  }
  return { policy: hookPolicy, executed: true, ok: true }
}

function ensurePluginDir(rootDir, pluginName, pluginVersion) {
  const dir = path.join(rootDir, safePluginName(pluginName), safePluginVersion(pluginVersion))
  fs.mkdirSync(dir, { recursive: true })
  return dir
}

function extractZipToDir(archivePath, targetDir) {
  const extract = spawnSync("unzip", ["-o", archivePath, "-d", targetDir], {
    encoding: "utf-8",
    timeout: 15000,
  })
  if (extract.error) {
    const msg = extract.error.code === "ENOENT"
      ? "'unzip' command is required for ZIP server plugins"
      : extract.error.message
    throw Object.assign(new Error(msg), {
      code: 105,
      type: "integration_error",
      recoverable: true,
      suggestions: ["Install unzip and run: supercli sync"],
    })
  }
  if (extract.status !== 0) {
    throw Object.assign(new Error(`Failed to extract ZIP server plugin: ${(extract.stderr || "").trim() || `exit ${extract.status}`}`), {
      code: 105,
      type: "integration_error",
      recoverable: true,
    })
  }
}

async function syncServerPlugins(server) {
  const lock = readServerPluginsLock()
  const installed = lock.installed || {}

  const r = await fetch(`${server}/api/plugins?format=json`)
  if (r.status === 404) {
    return {
      total: 0,
      enabled: 0,
      updated: [],
      unchanged: [],
      removed: [],
      shadowed_by_local: [],
      hook_results: [],
      skipped: true,
      reason: "server_plugins_endpoint_missing",
    }
  }
  if (!r.ok) {
    throw new Error(`Failed to fetch server plugins: ${r.status} ${r.statusText}`)
  }
  const payload = await r.json()
  const settings = payload.settings || { max_zip_mb: 10, default_hooks_policy: "deny" }
  const allPlugins = Array.isArray(payload.plugins) ? payload.plugins : []
  const enabledPlugins = allPlugins.filter(p => p && p.enabled !== false)

  const pluginRoot = path.join(SUPERCLI_PLUGINS_DIR, "server")
  fs.mkdirSync(pluginRoot, { recursive: true })

  const localPlugins = listInstalledPlugins()
  const localNames = new Set(localPlugins.map(p => p.name))
  const nextInstalled = {}
  const diagnostics = {
    total: allPlugins.length,
    enabled: enabledPlugins.length,
    updated: [],
    unchanged: [],
    removed: [],
    shadowed_by_local: [],
    hook_results: [],
  }

  const expectedNames = new Set(enabledPlugins.map(p => p.name))
  for (const [name, oldPlugin] of Object.entries(installed)) {
    if (expectedNames.has(name)) continue
    const oldPath = oldPlugin && oldPlugin.plugin_dir
    if (oldPath && fs.existsSync(oldPath)) fs.rmSync(oldPath, { recursive: true, force: true })
    diagnostics.removed.push(name)
  }

  for (const plugin of enabledPlugins) {
    if (!plugin || !plugin.name) continue
    if (localNames.has(plugin.name)) {
      diagnostics.shadowed_by_local.push(plugin.name)
      continue
    }

    const previous = installed[plugin.name]
    const checksumUnchanged = previous && previous.checksum === plugin.checksum
    if (checksumUnchanged) {
      nextInstalled[plugin.name] = previous
      diagnostics.unchanged.push(plugin.name)
      continue
    }

    const pluginDir = ensurePluginDir(pluginRoot, plugin.name, plugin.version)
    const manifest = plugin.manifest || null
    if (!manifest || typeof manifest !== "object") {
      throw Object.assign(new Error(`Server plugin '${plugin.name}' is missing manifest`), {
        code: 105,
        type: "integration_error",
        recoverable: true,
      })
    }

    fs.writeFileSync(path.join(pluginDir, "plugin.json"), JSON.stringify(manifest, null, 2))

    if (plugin.source_type === "zip") {
      const zipRes = await fetch(`${server}/api/plugins/${encodeURIComponent(plugin.name)}/archive`)
      if (!zipRes.ok) {
        throw Object.assign(new Error(`Failed to download ZIP for server plugin '${plugin.name}'`), {
          code: 105,
          type: "integration_error",
          recoverable: true,
        })
      }
      const bytes = Buffer.from(await zipRes.arrayBuffer())
      const archivePath = path.join(pluginDir, "plugin.zip")
      fs.writeFileSync(archivePath, bytes)
      extractZipToDir(archivePath, pluginDir)
    }

    const hookPolicy = resolveHooksPolicy(plugin, settings)
    const hookResult = runServerPluginPostInstall(pluginDir, { name: plugin.name, manifest }, hookPolicy)
    diagnostics.hook_results.push({ plugin: plugin.name, ...hookResult })

    nextInstalled[plugin.name] = {
      name: plugin.name,
      version: plugin.version,
      description: plugin.description || "",
      source: "server",
      source_type: plugin.source_type,
      checksum: plugin.checksum,
      has_learn: plugin.has_learn === true,
      tags: plugin.tags || [],
      hooks_policy: plugin.hooks_policy || "inherit",
      plugin_dir: pluginDir,
      installed_at: new Date().toISOString(),
      commands: Array.isArray(manifest.commands) ? manifest.commands.map(cmd => ({ ...cmd, plugin_name: plugin.name, plugin_dir: pluginDir })) : [],
    }
    diagnostics.updated.push(plugin.name)
  }

  writeServerPluginsLock({
    version: 1,
    fetched_at: new Date().toISOString(),
    settings,
    installed: nextInstalled,
  })

  return diagnostics
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
  let serverPlugins
  try {
    serverPlugins = await syncServerPlugins(server)
  } catch (err) {
    serverPlugins = {
      total: 0,
      enabled: 0,
      updated: [],
      unchanged: [],
      removed: [],
      shadowed_by_local: [],
      hook_results: [],
      skipped: true,
      reason: err.message,
    }
  }
  const written = writeCache(normalizeConfig(config))
  return {
    ...written,
    server_plugins: serverPlugins,
  }
}

async function setMcpServer(name, value) {
  const cfg = readCache() || emptyConfig()
  const servers = Array.isArray(cfg.mcp_servers) ? cfg.mcp_servers.slice() : []
  const idx = servers.findIndex(s => s && s.name === name)
  const incoming = typeof value === "string" ? { url: value } : (value && typeof value === "object" ? value : {})
  const next = normalizeMcpServerEntry(name, { name, ...incoming })
  if (!next) {
    throw Object.assign(new Error("Invalid MCP server definition"), {
      code: 85,
      type: "invalid_argument",
      recoverable: false
    })
  }
  if (idx >= 0) servers[idx] = next
  else servers.push(next)
  cfg.mcp_servers = normalizeMcpServers({ mcp_servers: servers })
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

async function upsertCommand(commandDef) {
  const cfg = readCache() || emptyConfig()
  const commands = Array.isArray(cfg.commands) ? cfg.commands.slice() : []
  const idx = commands.findIndex(c =>
    c &&
    c.namespace === commandDef.namespace &&
    c.resource === commandDef.resource &&
    c.action === commandDef.action,
  )
  if (idx >= 0) commands[idx] = commandDef
  else commands.push(commandDef)
  cfg.commands = commands
  writeCache(cfg)
  return commandDef
}

async function removeCommandsByNamespace(namespace) {
  const cfg = readCache() || emptyConfig()
  const commands = Array.isArray(cfg.commands) ? cfg.commands : []
  const next = commands.filter(c => !(c && c.namespace === namespace))
  const removed = commands.length - next.length
  cfg.commands = next
  writeCache(cfg)
  return removed
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
    server_plugins: Object.keys((readServerPluginsLock().installed || {})).length,
    mcp_servers: cache.mcp_servers ? cache.mcp_servers.length : 0,
    specs: cache.specs ? cache.specs.length : 0,
    cacheFile: CACHE_FILE
  }
}

module.exports = { loadConfig, syncConfig, showConfig, setMcpServer, removeMcpServer, listMcpServers, upsertCommand, removeCommandsByNamespace }
