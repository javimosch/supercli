const { Router } = require("express")
const { ObjectId } = require("mongodb")
const { getDb } = require("../db")
const { bumpVersion } = require("../services/configService")

const router = Router()

// ---- API ----

// GET /api/commands
router.get("/", async (req, res) => {
  try {
    const db = getDb()
    // If request accepts HTML and no JSON query, render page
    if (req.query.format !== "json" && req.accepts("html") && !req.xhr && !req.headers["x-requested-with"]) {
      const commands = await db.collection("commands").find().sort({ namespace: 1, resource: 1, action: 1 }).toArray()
      return res.render("commands", { commands })
    }
    const commands = await db.collection("commands").find().sort({ namespace: 1, resource: 1, action: 1 }).toArray()
    res.json(commands)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/commands/new — render create form
router.get("/new", async (req, res) => {
  res.render("command-edit", { command: null })
})

// GET /api/commands/:id/edit — render edit form
router.get("/:id/edit", async (req, res) => {
  try {
    const db = getDb()
    const command = await db.collection("commands").findOne({ _id: new ObjectId(req.params.id) })
    if (!command) return res.status(404).send("Not found")
    res.render("command-edit", { command })
  } catch (err) {
    res.status(500).send(err.message)
  }
})

// POST /api/commands
router.post("/", async (req, res) => {
  try {
    const db = getDb()
    const { namespace, resource, action, description, adapter, adapterConfig, args } = req.body
    const doc = {
      namespace,
      resource,
      action,
      description: description || "",
      adapter: adapter || "http",
      adapterConfig: typeof adapterConfig === "string" ? JSON.parse(adapterConfig || "{}") : (adapterConfig || {}),
      args: Array.isArray(args) ? args : JSON.parse(args || "[]"),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    await db.collection("commands").insertOne(doc)
    await bumpVersion(db)
    // If form submission, redirect
    if (req.headers["content-type"]?.includes("urlencoded")) {
      return res.redirect("/api/commands")
    }
    res.status(201).json(doc)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/commands/:id
router.put("/:id", async (req, res) => {
  try {
    const db = getDb()
    const { namespace, resource, action, description, adapter, adapterConfig, args } = req.body
    const update = {
      namespace,
      resource,
      action,
      description: description || "",
      adapter: adapter || "http",
      adapterConfig: typeof adapterConfig === "string" ? JSON.parse(adapterConfig || "{}") : (adapterConfig || {}),
      args: Array.isArray(args) ? args : JSON.parse(args || "[]"),
      updatedAt: new Date()
    }
    await db.collection("commands").updateOne({ _id: new ObjectId(req.params.id) }, { $set: update })
    await bumpVersion(db)
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/commands/:id
router.delete("/:id", async (req, res) => {
  try {
    const db = getDb()
    await db.collection("commands").deleteOne({ _id: new ObjectId(req.params.id) })
    await bumpVersion(db)
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
