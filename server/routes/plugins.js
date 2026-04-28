const { Router } = require("express")
const {
  getSettings,
  updateSettings,
  listServerPlugins,
  getServerPlugin,
  upsertJsonPlugin,
  upsertZipPlugin,
  updatePluginMetadata,
  removeServerPlugin,
  getPluginArchiveBuffer,
} = require("../services/pluginsService")
const { getStorage } = require("../storage/adapter")
const { registerPluginResources, unregisterPluginResources } = require("../services/pluginResourceService")
const { bumpVersion } = require("../services/configService")
const { requireAuth } = require("../middleware/auth")

const router = Router()

function handleError(res, err) {
  const status = err.code === 85 ? 400 : err.code === 92 ? 404 : 500
  res.status(status).json({ error: err.message, type: err.type || "internal_error" })
}

function parseBoolean(raw, fallback = true) {
  if (raw === undefined || raw === null || raw === "") return fallback
  const text = String(raw).trim().toLowerCase()
  if (text === "true") return true
  if (text === "false") return false
  return fallback
}

async function readRequestBuffer(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on("data", chunk => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)))
    req.on("end", () => resolve(Buffer.concat(chunks)))
    req.on("error", reject)
  })
}

function parseMultipartParts(buffer, boundary) {
  const delimiter = Buffer.from(`--${boundary}`)
  const closeDelimiter = Buffer.from(`--${boundary}--`)
  const parts = []
  let index = 0

  while (index < buffer.length) {
    const start = buffer.indexOf(delimiter, index)
    if (start < 0) break
    index = start + delimiter.length

    if (buffer.slice(index, index + 2).equals(Buffer.from("--"))) break
    if (buffer.slice(index, index + 2).equals(Buffer.from("\r\n"))) index += 2

    const headerEnd = buffer.indexOf(Buffer.from("\r\n\r\n"), index)
    if (headerEnd < 0) break
    const headerRaw = buffer.slice(index, headerEnd).toString("utf-8")
    const bodyStart = headerEnd + 4

    let nextBoundary = buffer.indexOf(delimiter, bodyStart)
    if (nextBoundary < 0) {
      nextBoundary = buffer.indexOf(closeDelimiter, bodyStart)
      if (nextBoundary < 0) nextBoundary = buffer.length
    }

    let body = buffer.slice(bodyStart, nextBoundary)
    if (body.slice(-2).equals(Buffer.from("\r\n"))) body = body.slice(0, -2)
    parts.push({ headerRaw, body })
    index = nextBoundary
  }

  return parts
}

function parseDisposition(headerRaw) {
  const line = headerRaw
    .split("\r\n")
    .find(item => item.toLowerCase().startsWith("content-disposition:"))
  if (!line) return {}

  const nameMatch = line.match(/name="([^"]+)"/)
  const fileMatch = line.match(/filename="([^"]*)"/)
  return {
    name: nameMatch ? nameMatch[1] : "",
    filename: fileMatch ? fileMatch[1] : "",
  }
}

async function parseMultipartFormData(req) {
  const contentType = String(req.headers["content-type"] || "")
  const boundaryMatch = contentType.match(/boundary=([^;]+)/i)
  if (!boundaryMatch) {
    throw Object.assign(new Error("Multipart boundary is required"), {
      code: 85,
      type: "invalid_argument",
      recoverable: false,
    })
  }
  const boundary = boundaryMatch[1].trim().replace(/^"|"$/g, "")
  const raw = await readRequestBuffer(req)
  const parts = parseMultipartParts(raw, boundary)
  const fields = {}
  let archiveBuffer = null

  for (const part of parts) {
    const disposition = parseDisposition(part.headerRaw)
    if (!disposition.name) continue
    if (disposition.filename) {
      if (disposition.name === "archive") archiveBuffer = part.body
      continue
    }
    fields[disposition.name] = part.body.toString("utf-8")
  }

  if (!archiveBuffer || archiveBuffer.length === 0) {
    throw Object.assign(new Error("Missing archive file in multipart payload"), {
      code: 85,
      type: "invalid_argument",
      recoverable: false,
    })
  }

  let manifest = null
  try {
    manifest = JSON.parse(String(fields.manifest || "{}"))
  } catch (err) {
    throw Object.assign(new Error(`Invalid manifest JSON: ${err.message}`), {
      code: 85,
      type: "invalid_argument",
      recoverable: false,
    })
  }

  return {
    name: String(fields.name || "").trim(),
    version: String(fields.version || "0.0.0").trim(),
    description: String(fields.description || ""),
    enabled: parseBoolean(fields.enabled, true),
    hooks_policy: String(fields.hooks_policy || "inherit").trim().toLowerCase(),
    tags: fields.tags
      ? String(fields.tags)
        .split(",")
        .map(v => v.trim())
        .filter(Boolean)
      : [],
    has_learn: parseBoolean(fields.has_learn, false),
    source_type: "zip",
    manifest,
    archive_buffer: archiveBuffer,
  }
}

router.get("/", requireAuth, async (req, res) => {
  try {
    const plugins = await listServerPlugins()
    const settings = await getSettings()
    if (req.query.format !== "json" && req.accepts("html") && !req.xhr && !req.headers["x-requested-with"]) {
      return res.render("plugins", { plugins, settings })
    }
    res.json({ plugins, settings })
  } catch (err) {
    handleError(res, err)
  }
})

router.get("/settings", allowIfNoApiKeys, async (req, res) => {
  try {
    const settings = await getSettings()
    if (req.query.format !== "json" && req.accepts("html") && !req.xhr && !req.headers["x-requested-with"]) {
      return res.render("settings", { settings })
    }
    res.json(settings)
  } catch (err) {
    handleError(res, err)
  }
})

router.put("/settings", allowIfNoApiKeys, async (req, res) => {
  try {
    const settings = await updateSettings(req.body || {})
    res.json({ ok: true, settings })
  } catch (err) {
    handleError(res, err)
  }
})

// Bootstrapping middleware for settings and api-keys when no API keys exist
async function allowIfNoApiKeys(req, res, next) {
  try {
    const { getCachedSettings } = require("../middleware/auth")
    const settings = await getCachedSettings()
    const apiKeys = Array.isArray(settings.api_keys) ? settings.api_keys : []
    if (apiKeys.length === 0) {
      return next()
    }
    // If API keys exist, require auth
    return requireAuth(req, res, next)
  } catch (err) {
    console.error("Bootstrapping middleware error:", err)
    // Fail open on error
    next()
  }
}

router.post("/", requireAuth, async (req, res) => {
  try {
    const sourceType = String((req.body && req.body.source_type) || "json").trim().toLowerCase()
    const plugin = sourceType === "zip"
      ? await upsertZipPlugin(req.body || {})
      : await upsertJsonPlugin(req.body || {})
    res.status(201).json({ ok: true, plugin })
  } catch (err) {
    handleError(res, err)
  }
})

router.post("/upload", requireAuth, async (req, res) => {
  try {
    const contentType = String(req.headers["content-type"] || "")
    const payload = contentType.includes("multipart/form-data")
      ? await parseMultipartFormData(req)
      : { ...(req.body || {}), source_type: "zip" }
    const plugin = await upsertZipPlugin(payload)
    res.status(201).json({ ok: true, plugin })
  } catch (err) {
    handleError(res, err)
  }
})

// List clients endpoint (must be before /:name)
router.get("/clients", requireAuth, async (req, res) => {
  try {
    const storage = getStorage()
    const clientKeys = await storage.listKeys("client:")
    const clients = []
    
    for (const key of clientKeys) {
      try {
        const client = await storage.get(key)
        if (client && client.client_id) {
          clients.push(client)
        }
      } catch (err) {
        // Skip if client read fails
      }
    }
    
    // Sort by last_seen descending
    clients.sort((a, b) => new Date(b.last_seen) - new Date(a.last_seen))
    
    if (req.query.format !== "json" && req.accepts("html") && !req.xhr && !req.headers["x-requested-with"]) {
      return res.render("clients", { clients })
    }
    
    res.json({ clients })
  } catch (err) {
    handleError(res, err)
  }
})

router.get("/:name", requireAuth, async (req, res) => {
  try {
    const plugin = await getServerPlugin(req.params.name)
    if (!plugin) {
      return res.status(404).json({ error: "Plugin not found", type: "resource_not_found" })
    }
    res.json(plugin)
  } catch (err) {
    handleError(res, err)
  }
})

router.patch("/:name", requireAuth, async (req, res) => {
  try {
    const plugin = await updatePluginMetadata(req.params.name, req.body || {})
    res.json({ ok: true, plugin })
  } catch (err) {
    handleError(res, err)
  }
})

router.delete("/:name", requireAuth, async (req, res) => {
  try {
    const removed = await removeServerPlugin(req.params.name)
    res.json({ ok: true, removed })
  } catch (err) {
    handleError(res, err)
  }
})

router.get("/:name/manifest", requireAuth, async (req, res) => {
  try {
    const plugin = await getServerPlugin(req.params.name)
    if (!plugin) {
      return res.status(404).json({ error: "Plugin not found", type: "resource_not_found" })
    }
    res.json({ name: plugin.name, manifest: plugin.manifest, checksum: plugin.checksum })
  } catch (err) {
    handleError(res, err)
  }
})

router.get("/:name/archive", requireAuth, async (req, res) => {
  try {
    const archive = await getPluginArchiveBuffer(req.params.name)
    if (!archive) {
      return res.status(404).json({ error: "Archive not found", type: "resource_not_found" })
    }
    res.setHeader("Content-Type", "application/zip")
    res.setHeader("Content-Length", String(archive.length))
    res.send(archive)
  } catch (err) {
    handleError(res, err)
  }
})

router.post("/client-resources", requireAuth, async (req, res) => {
  try {
    const storage = getStorage()
    const { client_id, plugins } = req.body || {}
    
    if (!Array.isArray(plugins)) {
      return res.status(400).json({ error: "plugins must be an array", type: "invalid_argument" })
    }
    
    if (!client_id || typeof client_id !== "string") {
      return res.status(400).json({ error: "client_id is required", type: "invalid_argument" })
    }
    
    // Update client last_seen
    await storage.set(`client:${client_id}`, {
      client_id: client_id,
      last_seen: new Date(),
      plugin_count: plugins.length
    })
    
    // Remove existing cli resources from this specific client only
    const allMcpKeys = await storage.listKeys("mcp:")
    const allSpecKeys = await storage.listKeys("spec:")
    const clientMcpKeys = allMcpKeys.filter(k => k.startsWith(`mcp:cli:${client_id}:`))
    const clientSpecKeys = allSpecKeys.filter(k => k.startsWith(`spec:cli:${client_id}:`))
    
    // Remove this client's existing resources
    for (const key of clientMcpKeys) {
      await storage.delete(key)
    }
    for (const key of clientSpecKeys) {
      await storage.delete(key)
    }
    
    // Store plugin metadata and register resources
    const results = { synced: plugins.length, registered_mcp: 0, registered_specs: 0, errors: [] }
    
    for (const plugin of plugins) {
      if (!plugin.name || !plugin.server_resources) continue
      
      try {
        // Store plugin metadata with client_id
        await storage.set(`plugin_client:${client_id}:${plugin.name}`, {
          name: plugin.name,
          server_resources: plugin.server_resources,
          client_id: client_id,
          synced_at: new Date()
        })
        
        // Register resources with client_id in key
        const regResults = await registerPluginResources(plugin.name, plugin.server_resources, "cli", client_id)
        results.registered_mcp += regResults.mcp.length
        results.registered_specs += regResults.specs.length
        results.errors.push(...regResults.errors)
      } catch (err) {
        results.errors.push(`Failed to sync plugin ${plugin.name}: ${err.message}`)
      }
    }
    
    await bumpVersion()
    res.json({ ok: true, ...results })
  } catch (err) {
    handleError(res, err)
  }
})

// List clients endpoint
router.get("/clients", async (req, res) => {
  try {
    const storage = getStorage()
    const clientKeys = await storage.listKeys("client:")
    const clients = []
    
    for (const key of clientKeys) {
      try {
        const client = await storage.get(key)
        if (client && client.client_id) {
          clients.push(client)
        }
      } catch (err) {
        // Skip if client read fails
      }
    }
    
    // Sort by last_seen descending
    clients.sort((a, b) => new Date(b.last_seen) - new Date(a.last_seen))
    
    if (req.query.format !== "json" && req.accepts("html") && !req.xhr && !req.headers["x-requested-with"]) {
      return res.render("clients", { clients })
    }
    
    res.json({ clients })
  } catch (err) {
    handleError(res, err)
  }
})

// API Keys endpoints

// GET /api/plugins/api-keys - Render API keys view
router.get("/api-keys", allowIfNoApiKeys, async (req, res) => {
  try {
    const settings = await getSettings()
    if (req.query.format !== "json" && req.accepts("html") && !req.xhr && !req.headers["x-requested-with"]) {
      return res.render("api-keys", { settings })
    }
    res.json({ api_keys: settings.api_keys || [] })
  } catch (err) {
    handleError(res, err)
  }
})

// POST /api/plugins/api-keys - Create API key
router.post("/api-keys", allowIfNoApiKeys, async (req, res) => {
  try {
    const { name } = req.body || {}
    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "name is required", type: "invalid_argument" })
    }

    const settings = await getSettings()
    const crypto = require("crypto")
    const key = crypto.randomBytes(32).toString("hex")

    const newApiKey = {
      name: String(name).trim(),
      key,
      created_at: new Date().toISOString()
    }

    const apiKeys = Array.isArray(settings.api_keys) ? settings.api_keys : []
    apiKeys.push(newApiKey)

    await updateSettings({ api_keys: apiKeys })
    res.status(201).json(newApiKey)
  } catch (err) {
    handleError(res, err)
  }
})

// DELETE /api/plugins/api-keys/:key - Delete API key
router.delete("/api-keys/:key", allowIfNoApiKeys, async (req, res) => {
  try {
    const keyToDelete = req.params.key
    const settings = await getSettings()
    const apiKeys = Array.isArray(settings.api_keys) ? settings.api_keys : []
    const filtered = apiKeys.filter(k => k.key !== keyToDelete)

    if (filtered.length === apiKeys.length) {
      return res.status(404).json({ error: "API key not found", type: "resource_not_found" })
    }

    await updateSettings({ api_keys: filtered })
    res.json({ ok: true })
  } catch (err) {
    handleError(res, err)
  }
})

module.exports = router
