const { Router } = require("express")
const { ObjectId } = require("mongodb")
const { getDb } = require("../db")
const { bumpVersion } = require("../services/configService")

const router = Router()

// GET /api/mcp — list or render page
router.get("/", async (req, res) => {
  try {
    const db = getDb()
    const servers = await db.collection("mcp").find().sort({ name: 1 }).toArray()
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
    const db = getDb()
    const { name, url } = req.body
    const doc = { name, url, createdAt: new Date() }
    await db.collection("mcp").insertOne(doc)
    await bumpVersion(db)
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
    const db = getDb()
    const { name, url } = req.body
    await db.collection("mcp").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { name, url } }
    )
    await bumpVersion(db)
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/mcp/:id
router.delete("/:id", async (req, res) => {
  try {
    const db = getDb()
    await db.collection("mcp").deleteOne({ _id: new ObjectId(req.params.id) })
    await bumpVersion(db)
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
