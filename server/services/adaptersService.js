const { getStorage } = require("../storage/adapter")
const { bumpVersion } = require("./configService")

const ADAPTER_PREFIX = "adapter:"
const ADAPTER_PACKAGES_PREFIX = "adapter_packages:"

function invalid(message) {
  return Object.assign(new Error(message), {
    code: 85,
    type: "invalid_argument",
    recoverable: false,
  })
}

function adapterKey(name) {
  return `${ADAPTER_PREFIX}${name}`
}

function adapterPackagesKey(name) {
  return `${ADAPTER_PACKAGES_PREFIX}${name}`
}

function sanitizeAdapter(adapter) {
  if (!adapter || typeof adapter !== "object") {
    throw invalid("adapter must be an object")
  }
  
  const name = String(adapter.name || "").trim()
  if (!name) throw invalid("adapter.name is required")
  if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(name)) {
    throw invalid("adapter.name must start with letter and contain only letters, numbers, underscores, hyphens")
  }
  
  const description = String(adapter.description || "")
  const source = String(adapter.source || "").trim()
  if (!source) throw invalid("adapter.source is required")
  
  const executionContext = ["server", "cli"].includes(adapter.execution_context) 
    ? adapter.execution_context 
    : "server"
  
  const dependencies = Array.isArray(adapter.dependencies) 
    ? adapter.dependencies.filter(d => typeof d === "string") 
    : []
  
  const timeoutMs = Number(adapter.timeout_ms) || 30000
  const memoryLimitMb = Number(adapter.memory_limit_mb) || 128
  const allowNetwork = adapter.allow_network === true
  
  return {
    name,
    description,
    execution_context: executionContext,
    source,
    dependencies,
    timeout_ms: timeoutMs,
    memory_limit_mb: memoryLimitMb,
    allow_network: allowNetwork,
  }
}

async function listAdapters() {
  const storage = getStorage()
  const keys = await storage.listKeys(ADAPTER_PREFIX)
  const records = await Promise.all(keys.map(k => storage.get(k)))
  return records
    .filter(Boolean)
    .sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")))
    .map(toPublicAdapter)
}

async function getAdapter(name) {
  const storage = getStorage()
  const record = await storage.get(adapterKey(name))
  if (!record) return null
  return toPublicAdapter(record)
}

async function getAdapterSource(name) {
  const storage = getStorage()
  const record = await storage.get(adapterKey(name))
  if (!record) return null
  return record.source || null
}

function toPublicAdapter(record) {
  return {
    name: record.name,
    description: record.description || "",
    execution_context: record.execution_context || "server",
    dependencies: record.dependencies || [],
    timeout_ms: record.timeout_ms || 30000,
    memory_limit_mb: record.memory_limit_mb || 128,
    allow_network: record.allow_network === true,
    created_at: record.created_at,
    updated_at: record.updated_at,
  }
}

async function createAdapter(payload) {
  const sanitized = sanitizeAdapter(payload)
  const now = new Date().toISOString()
  
  const record = {
    ...sanitized,
    created_at: now,
    updated_at: now,
  }
  
  const storage = getStorage()
  await storage.set(adapterKey(sanitized.name), record)
  await bumpVersion()
  return toPublicAdapter(record)
}

async function updateAdapter(name, payload) {
  const storage = getStorage()
  const key = adapterKey(name)
  const current = await storage.get(key)
  
  if (!current) {
    throw Object.assign(new Error(`Adapter '${name}' not found`), {
      code: 92,
      type: "resource_not_found",
      recoverable: false,
    })
  }
  
  const sanitized = sanitizeAdapter({ ...payload, name })
  const now = new Date().toISOString()
  
  const record = {
    ...sanitized,
    created_at: current.created_at || now,
    updated_at: now,
  }
  
  await storage.set(key, record)
  await bumpVersion()
  return toPublicAdapter(record)
}

async function deleteAdapter(name) {
  const storage = getStorage()
  const key = adapterKey(name)
  const current = await storage.get(key)
  if (!current) return false
  
  await storage.delete(key)
  await storage.delete(adapterPackagesKey(name))
  await bumpVersion()
  return true
}

async function getAdapterPackages(name) {
  const storage = getStorage()
  const packages = await storage.get(adapterPackagesKey(name))
  return packages || []
}

async function addAdapterPackage(name, packageName, version = "latest") {
  const storage = getStorage()
  const key = adapterPackagesKey(name)
  const current = await storage.get(key) || []
  
  const packageSpec = version === "latest" ? packageName : `${packageName}@${version}`
  
  if (!current.includes(packageSpec)) {
    current.push(packageSpec)
    await storage.set(key, current)
  }
  
  return current
}

async function removeAdapterPackage(name, packageName) {
  const storage = getStorage()
  const key = adapterPackagesKey(name)
  const current = await storage.get(key) || []
  
  const filtered = current.filter(p => !p.startsWith(`${packageName}@`) && p !== packageName)
  await storage.set(key, filtered)
  return filtered
}

async function setAdapterPackages(name, packages) {
  const storage = getStorage()
  const key = adapterPackagesKey(name)
  await storage.set(key, Array.isArray(packages) ? packages : [])
}

module.exports = {
  listAdapters,
  getAdapter,
  getAdapterSource,
  createAdapter,
  updateAdapter,
  deleteAdapter,
  getAdapterPackages,
  addAdapterPackage,
  removeAdapterPackage,
  setAdapterPackages,
}
