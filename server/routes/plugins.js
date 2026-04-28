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

router.get("/", async (req, res) => {
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

router.get("/settings", async (req, res) => {
  try {
    const settings = await getSettings()
    res.json(settings)
  } catch (err) {
    handleError(res, err)
  }
})

router.put("/settings", async (req, res) => {
  try {
    const settings = await updateSettings(req.body || {})
    res.json({ ok: true, settings })
  } catch (err) {
    handleError(res, err)
  }
})

router.post("/", async (req, res) => {
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

router.post("/upload", async (req, res) => {
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

router.get("/:name", async (req, res) => {
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

router.patch("/:name", async (req, res) => {
  try {
    const plugin = await updatePluginMetadata(req.params.name, req.body || {})
    res.json({ ok: true, plugin })
  } catch (err) {
    handleError(res, err)
  }
})

router.delete("/:name", async (req, res) => {
  try {
    const removed = await removeServerPlugin(req.params.name)
    res.json({ ok: true, removed })
  } catch (err) {
    handleError(res, err)
  }
})

router.get("/:name/manifest", async (req, res) => {
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

router.get("/:name/archive", async (req, res) => {
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

router.post("/client-resources", async (req, res) => {
  try {
    const storage = getStorage()
    const { plugins } = req.body || {}
    
    if (!Array.isArray(plugins)) {
      return res.status(400).json({ error: "plugins must be an array", type: "invalid_argument" })
    }
    
    // Replace all cli-origin resources with fresh sync
    const allMcpKeys = await storage.listKeys("mcp:")
    const allSpecKeys = await storage.listKeys("spec:")
    const cliMcpKeys = allMcpKeys.filter(k => k.startsWith("mcp:cli:"))
    const cliSpecKeys = allSpecKeys.filter(k => k.startsWith("spec:cli:"))
    
    // Remove existing cli resources
    for (const key of cliMcpKeys) {
      await storage.delete(key)
    }
    for (const key of cliSpecKeys) {
      await storage.delete(key)
    }
    
    // Store plugin metadata and register resources
    const results = { synced: plugins.length, registered_mcp: 0, registered_specs: 0, errors: [] }
    
    for (const plugin of plugins) {
      if (!plugin.name || !plugin.server_resources) continue
      
      try {
        // Store plugin metadata
        await storage.set(`plugin_client:${plugin.name}`, {
          name: plugin.name,
          server_resources: plugin.server_resources,
          synced_at: new Date()
        })
        
        // Register resources
        const regResults = await registerPluginResources(plugin.name, plugin.server_resources, "cli")
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

module.exports = router
