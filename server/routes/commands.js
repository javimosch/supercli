const { Router } = require("express")
const { getStorage } = require("../storage/adapter")
const { bumpVersion } = require("../services/configService")
const { validateAdapterConfig } = require("../../cli/adapter-schema")

const router = Router()

function invalid(message) {
  return Object.assign(new Error(message), {
    code: 85,
    type: "invalid_argument",
    recoverable: false,
  })
}

function parseAdapterConfig(value) {
  if (value === undefined || value === null || value === "") return {}
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value)
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw invalid("adapterConfig must be a JSON object")
      }
      return parsed
    } catch (err) {
      if (err.code === 85) throw err
      throw invalid(`Invalid adapterConfig JSON: ${err.message}`)
    }
  }
  if (typeof value === "object" && !Array.isArray(value)) return value
  throw invalid("adapterConfig must be an object")
}

function parseArgs(value) {
  if (value === undefined || value === null || value === "") return []
  if (Array.isArray(value)) return value
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value)
      if (!Array.isArray(parsed)) throw invalid("args must be a JSON array")
      return parsed
    } catch (err) {
      if (err.code === 85) throw err
      throw invalid(`Invalid args JSON: ${err.message}`)
    }
  }
  throw invalid("args must be an array")
}

function normalizeCommandPayload(payload) {
  const namespace = String(payload.namespace || "").trim()
  const resource = String(payload.resource || "").trim()
  const action = String(payload.action || "").trim()
  if (!namespace || !resource || !action) {
    throw invalid("namespace, resource, and action are required")
  }

  const adapter = String(payload.adapter || "http").trim()
  const adapterConfig = parseAdapterConfig(payload.adapterConfig)
  const args = parseArgs(payload.args)

  validateAdapterConfig({ adapter, adapterConfig })

  return {
    namespace,
    resource,
    action,
    description: String(payload.description || "").trim(),
    adapter,
    adapterConfig,
    args,
  }
}

// Helper to list all commands
async function getAllCommands() {
  const storage = getStorage()
  const keys = await storage.listKeys("command:")
  const commands = await Promise.all(keys.map(k => storage.get(k)))
  return commands.filter(Boolean).sort((a, b) => a._id.localeCompare(b._id))
}

// GET /api/commands
router.get("/", async (req, res) => {
  try {
    const commands = await getAllCommands()
    if (req.query.format !== "json" && req.accepts("html") && !req.xhr && !req.headers["x-requested-with"]) {
      return res.render("commands", { commands })
    }
    res.json(commands)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/commands/new
router.get("/new", async (req, res) => {
  res.render("command-edit", { command: null })
})

// POST /api/commands/validate
router.post("/validate", async (req, res) => {
  try {
    const normalized = normalizeCommandPayload(req.body || {})
    res.json({ ok: true, command: normalized })
  } catch (err) {
    const status = err.code === 85 ? 400 : 500
    res.status(status).json({ error: err.message, type: err.type || "internal_error" })
  }
})

// GET /api/commands/:id/edit
router.get("/:id/edit", async (req, res) => {
  try {
    const storage = getStorage()
    // id could be URL encoded if it's a natural key
    const id = decodeURIComponent(req.params.id)
    const command = await storage.get(id)
    if (!command) return res.status(404).send("Not found")
    res.render("command-edit", { command })
  } catch (err) {
    res.status(500).send(err.message)
  }
})

// POST /api/commands
router.post("/", async (req, res) => {
  try {
    const storage = getStorage()
    const normalized = normalizeCommandPayload(req.body || {})
    const { namespace, resource, action, description, adapter, adapterConfig, args } = normalized
    const key = `command:${namespace}.${resource}.${action}`
    
    // Check if exists? Overwrite is allowed for now, acts as upsert.

    const doc = {
      _id: key, // Store the key inside the document as well
      namespace,
      resource,
      action,
      description,
      adapter,
      adapterConfig,
      args,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await storage.set(key, doc)
    await bumpVersion()
    
    if (req.headers["content-type"]?.includes("urlencoded")) {
      return res.redirect("/api/commands")
    }
    res.status(201).json(doc)
  } catch (err) {
    const status = err.code === 85 ? 400 : 500
    res.status(status).json({ error: err.message, type: err.type || "internal_error" })
  }
})

// PUT /api/commands/:id
router.put("/:id", async (req, res) => {
  try {
    const storage = getStorage()
    const id = decodeURIComponent(req.params.id)
    const normalized = normalizeCommandPayload(req.body || {})
    const { namespace, resource, action, description, adapter, adapterConfig, args } = normalized
    
    // If n/r/a changed, the ID changes, we should delete the old one.
    const newKey = `command:${namespace}.${resource}.${action}`
    if (newKey !== id) {
      await storage.delete(id)
    }

    const update = {
      _id: newKey,
      namespace,
      resource,
      action,
      description,
      adapter,
      adapterConfig,
      args,
      updatedAt: new Date()
    }
    await storage.set(newKey, update)
    await bumpVersion()
    res.json({ ok: true })
  } catch (err) {
    const status = err.code === 85 ? 400 : 500
    res.status(status).json({ error: err.message, type: err.type || "internal_error" })
  }
})

// DELETE /api/commands/:id
router.delete("/:id", async (req, res) => {
  try {
    const storage = getStorage()
    const id = decodeURIComponent(req.params.id)
    await storage.delete(id)
    await bumpVersion()
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
