const fs = require("fs")
const path = require("path")

const REGISTRY_FILE = path.resolve(__dirname, "..", "plugins", "plugins.json")

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
  return {
    name: entry.name,
    description: entry.description || "",
    tags: Array.isArray(entry.tags) ? entry.tags.map(t => String(t)) : [],
    source: entry.source && typeof entry.source === "object" ? entry.source : {}
  }
}

function listRegistryPlugins(filters = {}) {
  const registry = readRegistry()
  const nameQuery = (filters.name || "").toLowerCase().trim()
  const tagQueries = (filters.tags || [])
    .map(t => String(t || "").toLowerCase().trim())
    .filter(Boolean)

  return registry.plugins
    .map(normalizePlugin)
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
  const registry = readRegistry()
  const found = registry.plugins.find(p => String(p.name || "").toLowerCase() === lower)
  return found ? normalizePlugin(found) : null
}

module.exports = {
  REGISTRY_FILE,
  readRegistry,
  listRegistryPlugins,
  getRegistryPlugin
}
