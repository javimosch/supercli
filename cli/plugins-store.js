const fs = require("fs")
const os = require("os")
const path = require("path")

const SUPERCLI_DIR = path.join(os.homedir(), ".supercli")
const SUPERCLI_PLUGINS_DIR = path.join(SUPERCLI_DIR, "plugins")
const SUPERCLI_LOCAL_LOCK_FILE = path.join(SUPERCLI_PLUGINS_DIR, "plugins.lock.json")
const SUPERCLI_SERVER_LOCK_FILE = path.join(SUPERCLI_PLUGINS_DIR, "server.lock.json")

const LEGACY_DCLI_DIR = path.join(os.homedir(), ".dcli")
const LEGACY_PLUGINS_FILE = path.join(LEGACY_DCLI_DIR, "plugins.lock.json")

function ensurePluginsDir() {
  if (!fs.existsSync(SUPERCLI_PLUGINS_DIR)) fs.mkdirSync(SUPERCLI_PLUGINS_DIR, { recursive: true })
}

function emptyLock() {
  return { version: 1, installed: {} }
}

function readLockFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) return emptyLock()
    const parsed = JSON.parse(fs.readFileSync(filePath, "utf-8"))
    if (!parsed || typeof parsed !== "object") return emptyLock()
    if (!parsed.installed || typeof parsed.installed !== "object") parsed.installed = {}
    return parsed
  } catch {
    return emptyLock()
  }
}

function writeLockFile(filePath, lock) {
  ensurePluginsDir()
  fs.writeFileSync(filePath, JSON.stringify(lock, null, 2))
  return lock
}

function readPluginsLock() {
  if (fs.existsSync(SUPERCLI_LOCAL_LOCK_FILE)) {
    return readLockFile(SUPERCLI_LOCAL_LOCK_FILE)
  }

  if (fs.existsSync(LEGACY_PLUGINS_FILE)) {
    const legacy = readLockFile(LEGACY_PLUGINS_FILE)
    writeLockFile(SUPERCLI_LOCAL_LOCK_FILE, legacy)
    return legacy
  }
  return emptyLock()
}

function writePluginsLock(lock) {
  return writeLockFile(SUPERCLI_LOCAL_LOCK_FILE, lock)
}

function readServerPluginsLock() {
  return readLockFile(SUPERCLI_SERVER_LOCK_FILE)
}

function writeServerPluginsLock(lock) {
  return writeLockFile(SUPERCLI_SERVER_LOCK_FILE, lock)
}

function listInstalledPlugins() {
  const lock = readPluginsLock()
  return Object.values(lock.installed)
}

function listServerInstalledPlugins() {
  const lock = readServerPluginsLock()
  return Object.values(lock.installed)
}

function pluginCommands(plugin) {
  const commands = []
  for (const cmd of (plugin.commands || [])) commands.push(cmd)
  return commands
}

function getInstalledPluginCommands() {
  return listInstalledPlugins().flatMap(pluginCommands)
}

function getServerPluginCommands() {
  return listServerInstalledPlugins().flatMap(pluginCommands)
}

function getEffectivePluginCommands() {
  const localPlugins = listInstalledPlugins()
  const serverPlugins = listServerInstalledPlugins()
  const localNames = new Set(localPlugins.map(p => p.name))

  const commands = []
  for (const plugin of localPlugins) commands.push(...pluginCommands(plugin))
  for (const plugin of serverPlugins) {
    if (localNames.has(plugin.name)) continue
    commands.push(...pluginCommands(plugin))
  }
  return commands
}

module.exports = {
  SUPERCLI_DIR,
  SUPERCLI_PLUGINS_DIR,
  SUPERCLI_LOCAL_LOCK_FILE,
  SUPERCLI_SERVER_LOCK_FILE,
  LEGACY_PLUGINS_FILE,
  readPluginsLock,
  writePluginsLock,
  readServerPluginsLock,
  writeServerPluginsLock,
  listInstalledPlugins,
  listServerInstalledPlugins,
  getInstalledPluginCommands,
  getServerPluginCommands,
  getEffectivePluginCommands,
}
