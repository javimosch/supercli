const { Router } = require("express")
const { getDb } = require("../db")

const router = Router()

// POST /api/jobs — record a command execution job
router.post("/", async (req, res) => {
  try {
    const db = getDb()
    const { command, args, status, duration_ms, timestamp, plan_id, error } = req.body
    const doc = {
      command,
      args: args || {},
      status: status || "unknown",
      duration_ms: duration_ms || 0,
      plan_id: plan_id || null,
      error: error || null,
      timestamp: timestamp || new Date().toISOString()
    }
    await db.collection("jobs").insertOne(doc)
    res.status(201).json(doc)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/jobs — list recent jobs
router.get("/", async (req, res) => {
  try {
    const db = getDb()
    const limit = parseInt(req.query.limit) || 50
    const command = req.query.command
    const query = command ? { command } : {}
    const jobs = await db.collection("jobs")
      .find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray()

    // If HTML request, render
    if (req.query.format !== "json" && req.accepts("html") && !req.xhr && !req.headers["x-requested-with"]) {
      return res.render("jobs", { jobs })
    }

    res.json(jobs)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/jobs/stats — aggregate stats
router.get("/stats", async (req, res) => {
  try {
    const db = getDb()
    const total = await db.collection("jobs").countDocuments()
    const success = await db.collection("jobs").countDocuments({ status: "success" })
    const failed = await db.collection("jobs").countDocuments({ status: "failed" })

    const topCommands = await db.collection("jobs").aggregate([
      { $group: { _id: "$command", count: { $sum: 1 }, avg_ms: { $avg: "$duration_ms" } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]).toArray()

    res.json({
      total,
      success,
      failed,
      failure_rate: total > 0 ? (failed / total * 100).toFixed(1) + "%" : "0%",
      top_commands: topCommands.map(t => ({ command: t._id, count: t.count, avg_ms: Math.round(t.avg_ms) }))
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/jobs/:id — get job details
router.get("/:id", async (req, res) => {
  try {
    const db = getDb()
    const { ObjectId } = require("mongodb")
    const job = await db.collection("jobs").findOne({ _id: new ObjectId(req.params.id) })
    if (!job) return res.status(404).json({ error: "Job not found" })
    res.json(job)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
