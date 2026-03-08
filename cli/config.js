const fs = require("fs")
const path = require("path")
const os = require("os")

const CACHE_DIR = path.join(os.homedir(), ".dcli")
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

function ttlValid(cache) {
  if (!cache || !cache.fetchedAt) return false
  const ttl = (cache.ttl || 3600) * 1000
  return (Date.now() - cache.fetchedAt) < ttl
}

async function fetchRemoteConfig(server) {
  const url = `${server}/api/config`
  const r = await fetch(url)
  if (!r.ok) throw new Error(`Failed to fetch config: ${r.status} ${r.statusText}`)
  return r.json()
}

async function loadConfig(server) {
  const cache = readCache()

  if (cache && ttlValid(cache)) {
    return cache
  }

  // Fetch remote
  const config = await fetchRemoteConfig(server)
  return writeCache(config)
}

async function refreshConfig(server) {
  const config = await fetchRemoteConfig(server)
  return writeCache(config)
}

async function showConfig() {
  const cache = readCache()
  if (!cache) {
    return { cached: false, message: "No config cached. Run: dcli config refresh" }
  }
  return {
    version: cache.version,
    ttl: cache.ttl,
    fetchedAt: new Date(cache.fetchedAt).toISOString(),
    commands: cache.commands ? cache.commands.length : 0,
    cacheFile: CACHE_FILE
  }
}

module.exports = { loadConfig, refreshConfig, showConfig }
