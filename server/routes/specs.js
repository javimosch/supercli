const { Router } = require("express")
const { ObjectId } = require("mongodb")
const { getDb } = require("../db")
const { bumpVersion } = require("../services/configService")

const router = Router()

// GET /api/specs — list or render page
router.get("/", async (req, res) => {
  try {
    const db = getDb()
    const specs = await db.collection("specs").find().sort({ name: 1 }).toArray()
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
    const db = getDb()
    const { name, url, auth } = req.body
    const doc = { name, url, auth: auth || "none", createdAt: new Date() }
    await db.collection("specs").insertOne(doc)
    await bumpVersion(db)
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
    const db = getDb()
    const { name, url, auth } = req.body
    await db.collection("specs").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { name, url, auth: auth || "none" } }
    )
    await bumpVersion(db)
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/specs/:id
router.delete("/:id", async (req, res) => {
  try {
    const db = getDb()
    await db.collection("specs").deleteOne({ _id: new ObjectId(req.params.id) })
    await bumpVersion(db)
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
