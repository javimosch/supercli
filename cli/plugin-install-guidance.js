"use strict";

const fs = require("fs")
const path = require("path")
const { readPluginsLock } = require("./plugins-store")
const { getRegistryPlugin } = require("./plugins-registry")

const { PLUGIN_INSTALL_GUIDANCE } = require("./plugin-install-guidance-data")


function normalizeInstallGuidance(guidance, pluginName) {
  if (!guidance || typeof guidance !== "object" || Array.isArray(guidance)) return null
  const normalized = {
    plugin: typeof guidance.plugin === "string" && guidance.plugin ? guidance.plugin : String(pluginName || ""),
    binary: typeof guidance.binary === "string" ? guidance.binary : "",
    check: typeof guidance.check === "string" ? guidance.check : "",
    install_steps: Array.isArray(guidance.install_steps) ? guidance.install_steps.map(step => String(step)).filter(Boolean) : [],
    note: typeof guidance.note === "string" ? guidance.note : "",
  }
  if (!normalized.plugin) return null
  return (!normalized.binary && !normalized.check && normalized.install_steps.length === 0 && !normalized.note) ? null : normalized
}

function readManifestGuidance(manifestPath, pluginName) {
  if (!manifestPath || !fs.existsSync(manifestPath)) return null
  try {
    const parsed = JSON.parse(fs.readFileSync(manifestPath, "utf-8"))
    return normalizeInstallGuidance(parsed.install_guidance, pluginName || parsed.name)
  } catch {
    return null
  }
}

function readInstallGuidanceFile(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return null
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, "utf-8"))
    const pluginName = path.basename(path.dirname(filePath))
    return normalizeInstallGuidance(parsed, pluginName)
  } catch {
    return null
  }
}

function findInstalledPlugin(name) {
  const lower = String(name || "").toLowerCase().trim()
  if (!lower) return null
  const lock = readPluginsLock()
  return Object.values(lock.installed || {}).find(p => String(p && p.name || "").toLowerCase() === lower) || null
}

function resolveRegistryManifestPath(entry) {
  if (!entry || !entry.source || typeof entry.source !== "object") return null
  const manifestPath = entry.source.manifest_path
  if (!manifestPath || typeof manifestPath !== "string") return null
  if (path.isAbsolute(manifestPath)) return manifestPath
  return path.resolve(__dirname, "..", manifestPath)
}

function getPluginInstallGuidance(name) {
  const lower = String(name || "").toLowerCase().trim()
  if (!lower) return null

  const installed = findInstalledPlugin(lower)
  if (installed) {
    const stored = normalizeInstallGuidance(installed.install_guidance, installed.name)
    if (stored) return stored
    const resolved = installed.resolved_from && installed.resolved_from.manifest_path ? readManifestGuidance(installed.resolved_from.manifest_path, installed.name) : null
    if (resolved) return resolved
  }

  const registryEntry = getRegistryPlugin(lower)
  if (registryEntry) {
    const inline = normalizeInstallGuidance(registryEntry.install_guidance, registryEntry.name)
    if (inline) return inline
    const fromManifest = readManifestGuidance(resolveRegistryManifestPath(registryEntry), registryEntry.name)
    if (fromManifest) return fromManifest
  }

  const pluginDir = path.resolve(__dirname, "..", "plugins", lower)

  const fromMeta = readInstallGuidanceFile(path.join(pluginDir, "meta.json"))
  if (fromMeta) return fromMeta

  const fromGuidanceFile = readInstallGuidanceFile(path.join(pluginDir, "install-guidance.json"))
  if (fromGuidanceFile) return fromGuidanceFile

  const bundledManifest = path.join(pluginDir, "plugin.json")
  const bundled = readManifestGuidance(bundledManifest, lower)
  if (bundled) return bundled

  return PLUGIN_INSTALL_GUIDANCE[lower] || null
}

module.exports = {
  getPluginInstallGuidance,
  normalizeInstallGuidance,
}
