const { Router } = require("express")
const { getStorage } = require("../storage/adapter")
const { bumpVersion } = require("../services/configService")

const router = Router()

function sanitizeMcpPayload(payload, fallbackName) {
  const name = typeof payload.name === "string" ? payload.name : fallbackName
  if (!name) return null
  const out = { name }
  if (typeof payload.url === "string") out.url = payload.url
  if (typeof payload.command === "string") out.command = payload.command
  if (Array.isArray(payload.args)) out.args = payload.args.filter(v => typeof v === "string")
  if (payload.headers && typeof payload.headers === "object" && !Array.isArray(payload.headers)) {
    out.headers = Object.fromEntries(Object.entries(payload.headers).filter(([k, v]) => typeof k === "string" && typeof v === "string"))
  }
  if (payload.env && typeof payload.env === "object" && !Array.isArray(payload.env)) {
    out.env = Object.fromEntries(Object.entries(payload.env).filter(([k, v]) => typeof k === "string" && typeof v === "string"))
  }
  if (typeof payload.timeout_ms === "number" && payload.timeout_ms > 0) out.timeout_ms = payload.timeout_ms
  if (payload.stateful === true || payload.stateful === "true" || payload.stateful === "on") out.stateful = true
  if (typeof payload.pluginSource === "string") out.pluginSource = payload.pluginSource
  return out
}

async function getAllMCPs() {
  const storage = getStorage()
  const keys = await storage.listKeys("mcp:")
  const servers = await Promise.all(keys.map(k => storage.get(k)))
  return servers.sort((a, b) => a.name.localeCompare(b.name))
}

// GET /api/mcp
router.get("/", async (req, res) => {
  try {
    const servers = await getAllMCPs()
    if (req.query.format !== "json" && req.accepts("html") && !req.xhr && !req.headers["x-requested-with"]) {
      return res.render("mcp", { servers })
    }
    res.json(servers)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/mcp
router.post("/", async (req, res) => {
  try {
    const storage = getStorage()
    const sanitized = sanitizeMcpPayload(req.body || {})
    if (!sanitized || (!sanitized.url && !sanitized.command)) {
      return res.status(400).json({ error: "MCP server requires name and one of: url or command" })
    }
    const { name } = sanitized
    const key = `mcp:${name}`
    const doc = { _id: key, ...sanitized, createdAt: new Date() }
    await storage.set(key, doc)
    await bumpVersion()
    if (req.headers["content-type"]?.includes("urlencoded")) {
      return res.redirect("/api/mcp")
    }
    res.status(201).json(doc)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/mcp/:id
router.put("/:id", async (req, res) => {
  try {
    const storage = getStorage()
    const id = decodeURIComponent(req.params.id)
    const currentName = id.startsWith("mcp:") ? id.slice(4) : undefined
    const sanitized = sanitizeMcpPayload(req.body || {}, currentName)
    if (!sanitized || (!sanitized.url && !sanitized.command)) {
      return res.status(400).json({ error: "MCP server requires name and one of: url or command" })
    }
    const { name } = sanitized
    
    const newKey = `mcp:${name}`
    if (newKey !== id) {
      await storage.delete(id)
    }

    const doc = { _id: newKey, ...sanitized }
    await storage.set(newKey, doc)
    await bumpVersion()
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/mcp/:id
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
