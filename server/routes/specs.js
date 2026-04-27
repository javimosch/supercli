const { Router } = require("express")
const { getStorage } = require("../storage/adapter")
const { bumpVersion } = require("../services/configService")

const router = Router()

async function getAllSpecs() {
  const storage = getStorage()
  const keys = await storage.listKeys("spec:")
  const specs = await Promise.all(keys.map(k => storage.get(k)))
  return specs.sort((a, b) => a.name.localeCompare(b.name))
}

// GET /api/specs
router.get("/", async (req, res) => {
  try {
    const specs = await getAllSpecs()
    if (req.query.format !== "json" && req.accepts("html") && !req.xhr && !req.headers["x-requested-with"]) {
      return res.render("specs", { specs })
    }
    res.json(specs)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/specs
router.post("/", async (req, res) => {
  try {
    const storage = getStorage()
    const { name, url, auth } = req.body
    const key = `spec:${name}`
    // Support both simple string auth and object auth
    const authValue = auth || "none"
    const doc = { _id: key, name, url, auth: authValue, createdAt: new Date() }
    await storage.set(key, doc)
    await bumpVersion()
    if (req.headers["content-type"]?.includes("urlencoded")) {
      return res.redirect("/api/specs")
    }
    res.status(201).json(doc)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/specs/:id
router.put("/:id", async (req, res) => {
  try {
    const storage = getStorage()
    const id = decodeURIComponent(req.params.id)
    const { name, url, auth } = req.body
    
    const newKey = `spec:${name}`
    if (newKey !== id) {
      await storage.delete(id)
    }

    // Support both simple string auth and object auth
    const authValue = auth || "none"
    const doc = { _id: newKey, name, url, auth: authValue }
    await storage.set(newKey, doc)
    await bumpVersion()
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/specs/:id
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
