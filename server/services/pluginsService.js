const crypto = require("crypto")
const { getStorage } = require("../storage/adapter")
const { bumpVersion } = require("./configService")

const PLUGIN_PREFIX = "plugin_server:"
const SETTINGS_KEY = "settings:plugins"

function invalid(message) {
  return Object.assign(new Error(message), {
    code: 85,
    type: "invalid_argument",
    recoverable: false,
  })
}

function defaultSettings() {
  return {
    max_zip_mb: 10,
    default_hooks_policy: "deny",
    admin_mode_enabled: false,
  }
}

function pluginKey(name) {
  return `${PLUGIN_PREFIX}${name}`
}

function normalizeStringArray(value) {
  if (!Array.isArray(value)) return []
  return value.map(v => String(v)).filter(Boolean)
}

function sanitizeManifest(manifest, expectedName) {
  if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) {
    throw invalid("manifest must be an object")
  }
  const name = String(manifest.name || "").trim()
  if (!name) throw invalid("manifest.name is required")
  if (expectedName && name !== expectedName) {
    throw invalid(`manifest.name '${name}' must match plugin name '${expectedName}'`)
  }
  if (!Array.isArray(manifest.commands)) {
    throw invalid("manifest.commands must be an array")
  }
  return manifest
}

function sanitizeHooksPolicy(value, fallback) {
  const raw = String(value || fallback || "inherit").trim().toLowerCase()
  if (!["inherit", "allow", "deny"].includes(raw)) {
    throw invalid("hooks_policy must be one of: inherit, allow, deny")
  }
  return raw
}

function hashBuffer(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex")
}

function isUnsafeZipEntryName(name) {
  if (!name) return true
  if (name.startsWith("/") || name.startsWith("\\")) return true
  if (/^[a-zA-Z]:[\\/]/.test(name)) return true
  if (name.includes("../") || name.includes("..\\")) return true
  return false
}

function inspectZipEntries(buffer) {
  let totalUncompressed = 0
  let entries = 0
  for (let i = 0; i <= buffer.length - 46; i++) {
    if (buffer[i] !== 0x50 || buffer[i + 1] !== 0x4b || buffer[i + 2] !== 0x01 || buffer[i + 3] !== 0x02) {
      continue
    }
    const uncompressedSize = buffer.readUInt32LE(i + 24)
    const fileNameLength = buffer.readUInt16LE(i + 28)
    const extraLength = buffer.readUInt16LE(i + 30)
    const commentLength = buffer.readUInt16LE(i + 32)
    const fileNameStart = i + 46
    const fileNameEnd = fileNameStart + fileNameLength
    if (fileNameEnd > buffer.length) throw invalid("ZIP appears corrupted")

    const fileName = buffer.subarray(fileNameStart, fileNameEnd).toString("utf-8")
    if (isUnsafeZipEntryName(fileName)) {
      throw invalid(`ZIP contains unsafe path '${fileName}'`)
    }

    totalUncompressed += Number(uncompressedSize)
    entries += 1
    i = fileNameEnd + extraLength + commentLength - 1
  }
  if (entries === 0) throw invalid("ZIP has no central directory entries")
  return { entries, totalUncompressed }
}

async function getSettings() {
  const storage = getStorage()
  const stored = await storage.get(SETTINGS_KEY)
  const merged = { ...defaultSettings(), ...(stored || {}) }
  const maxZip = Number(merged.max_zip_mb)
  if (!Number.isFinite(maxZip) || maxZip <= 0) merged.max_zip_mb = 10
  merged.default_hooks_policy = sanitizeHooksPolicy(merged.default_hooks_policy, "deny")
  return merged
}

async function updateSettings(patch = {}) {
  const current = await getSettings()
  const next = { ...current }
  if (patch.max_zip_mb !== undefined) {
    const value = Number(patch.max_zip_mb)
    if (!Number.isFinite(value) || value <= 0) {
      throw invalid("max_zip_mb must be a positive number")
    }
    next.max_zip_mb = value
  }
  if (patch.default_hooks_policy !== undefined) {
    next.default_hooks_policy = sanitizeHooksPolicy(patch.default_hooks_policy, next.default_hooks_policy)
  }
  if (patch.admin_mode_enabled !== undefined) {
    next.admin_mode_enabled = patch.admin_mode_enabled === true || patch.admin_mode_enabled === "true"
  }
  const storage = getStorage()
  await storage.set(SETTINGS_KEY, next)
  return next
}

function toPublicPlugin(record) {
  return {
    name: record.name,
    version: record.version,
    description: record.description || "",
    source_type: record.source_type,
    enabled: record.enabled !== false,
    checksum: record.checksum,
    size_bytes: record.size_bytes || 0,
    has_learn: record.has_learn === true,
    tags: normalizeStringArray(record.tags),
    hooks_policy: record.hooks_policy || "inherit",
    updated_at: record.updated_at,
    manifest: record.manifest,
  }
}

async function listServerPlugins() {
  const storage = getStorage()
  const keys = await storage.listKeys(PLUGIN_PREFIX)
  const records = await Promise.all(keys.map(k => storage.get(k)))
  return records
    .filter(Boolean)
    .sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")))
    .map(toPublicPlugin)
}

async function getServerPlugin(name) {
  const storage = getStorage()
  const record = await storage.get(pluginKey(name))
  if (!record) return null
  return toPublicPlugin(record)
}

function normalizeCommonPayload(payload) {
  const name = String(payload.name || "").trim()
  if (!name) throw invalid("name is required")
  const version = String(payload.version || "0.0.0").trim() || "0.0.0"
  const description = String(payload.description || "")
  const enabled = payload.enabled === undefined ? true : payload.enabled === true
  const hasLearn = payload.has_learn === true
  const tags = normalizeStringArray(payload.tags)
  const hooksPolicy = sanitizeHooksPolicy(payload.hooks_policy, "inherit")
  return {
    name,
    version,
    description,
    enabled,
    has_learn: hasLearn,
    tags,
    hooks_policy: hooksPolicy,
  }
}

async function upsertJsonPlugin(payload) {
  const common = normalizeCommonPayload(payload)
  const manifest = sanitizeManifest(payload.manifest, common.name)
  const content = Buffer.from(JSON.stringify(manifest, null, 2), "utf-8")
  const now = new Date().toISOString()
  const next = {
    ...common,
    source_type: "json",
    manifest,
    archive_base64: null,
    checksum: hashBuffer(content),
    size_bytes: content.length,
    updated_at: now,
  }
  const storage = getStorage()
  await storage.set(pluginKey(common.name), next)
  await bumpVersion()
  return toPublicPlugin(next)
}

async function upsertZipPlugin(payload) {
  const common = normalizeCommonPayload(payload)
  const manifest = sanitizeManifest(payload.manifest, common.name)
  const archiveBase64 = payload.archive_base64 ? String(payload.archive_base64).trim() : ""
  const archiveBuffer = Buffer.isBuffer(payload.archive_buffer) ? payload.archive_buffer : null
  if (!archiveBase64 && !archiveBuffer) throw invalid("ZIP payload is required")

  const buffer = archiveBuffer || Buffer.from(archiveBase64, "base64")
  if (!buffer.length) throw invalid("archive_base64 is empty or invalid")

  const settings = await getSettings()
  const maxBytes = Math.floor(Number(settings.max_zip_mb) * 1024 * 1024)
  if (buffer.length > maxBytes) {
    throw invalid(`ZIP exceeds max size of ${settings.max_zip_mb}MB`)
  }
  if (!(buffer[0] === 0x50 && buffer[1] === 0x4b)) {
    throw invalid("archive_base64 must be a ZIP payload")
  }
  const zipStats = inspectZipEntries(buffer)
  if (zipStats.totalUncompressed > maxBytes * 5) {
    throw invalid("ZIP uncompressed content exceeds safety threshold")
  }

  const now = new Date().toISOString()
  const next = {
    ...common,
    source_type: "zip",
    manifest,
    archive_base64: buffer.toString("base64"),
    checksum: hashBuffer(buffer),
    size_bytes: buffer.length,
    updated_at: now,
  }
  const storage = getStorage()
  await storage.set(pluginKey(common.name), next)
  await bumpVersion()
  return toPublicPlugin(next)
}

async function setPluginEnabled(name, enabled) {
  const storage = getStorage()
  const key = pluginKey(name)
  const current = await storage.get(key)
  if (!current) {
    throw Object.assign(new Error(`Server plugin '${name}' not found`), {
      code: 92,
      type: "resource_not_found",
      recoverable: false,
    })
  }
  current.enabled = enabled === true
  current.updated_at = new Date().toISOString()
  await storage.set(key, current)
  await bumpVersion()
  return toPublicPlugin(current)
}

async function updatePluginMetadata(name, patch = {}) {
  const storage = getStorage()
  const key = pluginKey(name)
  const current = await storage.get(key)
  if (!current) {
    throw Object.assign(new Error(`Server plugin '${name}' not found`), {
      code: 92,
      type: "resource_not_found",
      recoverable: false,
    })
  }
  if (patch.enabled !== undefined) current.enabled = patch.enabled === true
  if (patch.hooks_policy !== undefined) {
    current.hooks_policy = sanitizeHooksPolicy(patch.hooks_policy, current.hooks_policy || "inherit")
  }
  current.updated_at = new Date().toISOString()
  await storage.set(key, current)
  await bumpVersion()
  return toPublicPlugin(current)
}

async function removeServerPlugin(name) {
  const storage = getStorage()
  const key = pluginKey(name)
  const current = await storage.get(key)
  if (!current) return false
  await storage.delete(key)
  await bumpVersion()
  return true
}

async function getPluginArchiveBuffer(name) {
  const storage = getStorage()
  const current = await storage.get(pluginKey(name))
  if (!current || current.source_type !== "zip" || !current.archive_base64) return null
  return Buffer.from(current.archive_base64, "base64")
}

module.exports = {
  getSettings,
  updateSettings,
  listServerPlugins,
  getServerPlugin,
  upsertJsonPlugin,
  upsertZipPlugin,
  setPluginEnabled,
  updatePluginMetadata,
  removeServerPlugin,
  getPluginArchiveBuffer,
}
