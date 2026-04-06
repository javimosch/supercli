const fs = require("fs")
const path = require("path")

const REGISTRY_FILE = path.resolve(__dirname, "..", "plugins", "plugins.json")
const BUNDLED_PLUGINS_DIR = path.resolve(__dirname, "..", "plugins")

function invalid(message) {
  return Object.assign(new Error(message), {
    code: 85,
    type: "invalid_argument",
    recoverable: false
  })
}

function readRegistry() {
  if (!fs.existsSync(REGISTRY_FILE)) {
    return { version: 1, plugins: [] }
  }

  let parsed
  try {
    parsed = JSON.parse(fs.readFileSync(REGISTRY_FILE, "utf-8"))
  } catch (err) {
    throw invalid(`Invalid plugin registry at ${REGISTRY_FILE}: ${err.message}`)
  }

  if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.plugins)) {
    throw invalid("Invalid plugin registry: expected object with plugins array")
  }

  return parsed
}

function normalizePlugin(entry) {
  const source = entry.source && typeof entry.source === "object" ? entry.source : {}
  return {
    name: entry.name,
    description: entry.description || "",
    tags: Array.isArray(entry.tags) ? entry.tags.map(t => String(t)) : [],
    source,
    has_learn: entry.has_learn === true,
    install_guidance: entry.install_guidance && typeof entry.install_guidance === "object"
      ? entry.install_guidance
      : null,
  }
}

function readManifest(filePath) {
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, "utf-8"))
    if (!parsed || typeof parsed !== "object" || !parsed.name || !Array.isArray(parsed.commands)) return null
    return parsed
  } catch {
    return null
  }
}

function readMetaFile(metaPath) {
  try {
    if (!fs.existsSync(metaPath)) return null
    const parsed = JSON.parse(fs.readFileSync(metaPath, "utf-8"))
    if (!parsed || typeof parsed !== "object") return null
    return parsed
  } catch {
    return null
  }
}

function discoverBundledPlugins() {
  if (!fs.existsSync(BUNDLED_PLUGINS_DIR)) return []
  let entries
  try {
    entries = fs.readdirSync(BUNDLED_PLUGINS_DIR, { withFileTypes: true })
  } catch {
    return []
  }
  if (!Array.isArray(entries)) return []
  const plugins = []

  for (const entry of entries) {
    if (!entry || !entry.isDirectory()) continue
    const manifestPath = path.join(BUNDLED_PLUGINS_DIR, entry.name, "plugin.json")
    if (!fs.existsSync(manifestPath)) continue
    const manifest = readManifest(manifestPath)
    if (!manifest) continue

    const metaPath = path.join(BUNDLED_PLUGINS_DIR, entry.name, "meta.json")
    const meta = readMetaFile(metaPath)

    plugins.push({
      name: manifest.name,
      description: meta && typeof meta.description === "string" ? meta.description : (manifest.description || ""),
      tags: meta && Array.isArray(meta.tags) ? meta.tags : (Array.isArray(manifest.tags) ? manifest.tags : []),
      source: {
        type: "bundled",
        manifest_path: path.relative(path.resolve(__dirname, ".."), manifestPath).replace(/\\/g, "/")
      },
      has_learn: meta && meta.has_learn === true
        ? true
        : (!!manifest.learn),
      install_guidance: meta && meta.install_guidance && typeof meta.install_guidance === "object"
        ? meta.install_guidance
        : (manifest.install_guidance && typeof manifest.install_guidance === "object"
          ? manifest.install_guidance
          : null),
    })
  }

  return plugins
}

function mergedRegistryPlugins() {
  const registry = readRegistry()
  const discovered = discoverBundledPlugins()
  const merged = new Map()

  for (const plugin of discovered) {
    const normalized = normalizePlugin(plugin)
    merged.set(String(normalized.name || "").toLowerCase(), normalized)
  }

  for (const plugin of (registry.plugins || [])) {
    const normalized = normalizePlugin(plugin)
    merged.set(String(normalized.name || "").toLowerCase(), normalized)
  }

  return Array.from(merged.values())
}

function listRegistryPlugins(filters = {}) {
  const nameQuery = (filters.name || "").toLowerCase().trim()
  const tagQueries = (filters.tags || [])
    .map(t => String(t || "").toLowerCase().trim())
    .filter(Boolean)

  return mergedRegistryPlugins()
    .filter(entry => {
      if (nameQuery) {
        const text = `${entry.name} ${entry.description}`.toLowerCase()
        if (!text.includes(nameQuery)) return false
      }

      if (tagQueries.length > 0) {
        const tags = entry.tags.map(t => t.toLowerCase())
        const anyMatch = tagQueries.some(q => tags.includes(q))
        if (!anyMatch) return false
      }

      return true
    })
}

function getRegistryPlugin(name) {
  const lower = String(name || "").toLowerCase()
  if (!lower) return null
  return mergedRegistryPlugins().find(p => String(p.name || "").toLowerCase() === lower) || null
}

module.exports = {
  REGISTRY_FILE,
  BUNDLED_PLUGINS_DIR,
  readRegistry,
  discoverBundledPlugins,
  listRegistryPlugins,
  getRegistryPlugin
}
