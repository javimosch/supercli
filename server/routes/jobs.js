const { Router } = require("express")
const { getStorage } = require("../storage/adapter")

const router = Router()

// POST /api/jobs — record a command execution job
router.post("/", async (req, res) => {
  try {
    const storage = getStorage()
    const { command, args, status, duration_ms, timestamp, plan_id, error, client_id } = req.body
    
    // Generate a unique sequential-ish ID
    const jobId = `job:${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    
    const doc = {
      _id: jobId,
      command,
      args: args || {},
      status: status || "unknown",
      duration_ms: duration_ms || 0,
      plan_id: plan_id || null,
      error: error || null,
      timestamp: timestamp || new Date().toISOString(),
      client_id: client_id || null
    }
    
    await storage.set(jobId, doc)
    res.status(201).json(doc)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/jobs — list recent jobs
router.get("/", async (req, res) => {
  try {
    const storage = getStorage()
    const limit = parseInt(req.query.limit) || 50
    const commandQuery = req.query.command
    
    const keys = await storage.listKeys("job:")
    let jobs = await Promise.all(keys.map(k => storage.get(k)))
    
    jobs = jobs.filter(j => !!j)
    if (commandQuery) {
      jobs = jobs.filter(j => j.command === commandQuery)
    }
    
    // Sort descending by timestamp
    jobs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    jobs = jobs.slice(0, limit)

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
    const storage = getStorage()
    const keys = await storage.listKeys("job:")
    const jobs = await Promise.all(keys.map(k => storage.get(k)))
    
    const total = jobs.length
    let success = 0
    let failed = 0
    const commandStats = {}
    
    for (const job of jobs) {
      if (!job) continue
      if (job.status === "success") success++
      if (job.status === "failed") failed++
      
      const cmd = job.command
      if (!commandStats[cmd]) {
        commandStats[cmd] = { count: 0, sum_ms: 0 }
      }
      commandStats[cmd].count++
      commandStats[cmd].sum_ms += job.duration_ms
    }
    
    const topCommands = Object.entries(commandStats)
      .map(([cmd, stats]) => ({
        command: cmd,
        count: stats.count,
        avg_ms: Math.round(stats.sum_ms / stats.count) || 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    res.json({
      total,
      success,
      failed,
      failure_rate: total > 0 ? (failed / total * 100).toFixed(1) + "%" : "0%",
      top_commands: topCommands
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/jobs/:id — get job details
router.get("/:id", async (req, res) => {
  try {
    const storage = getStorage()
    const id = decodeURIComponent(req.params.id)
    const job = await storage.get(id.startsWith("job:") ? id : `job:${id}`)
    if (!job) return res.status(404).json({ error: "Job not found" })
    res.json(job)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/jobs — prune old jobs (admin mode)
router.delete("/", async (req, res) => {
  try {
    const storage = getStorage()
    const olderThanDays = parseInt(req.query.older_than) || 7
    const cutoff = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000)
    
    const keys = await storage.listKeys("job:")
    const jobs = await Promise.all(keys.map(k => storage.get(k)))
    
    let pruned = 0
    for (const job of jobs) {
      if (!job || !job.timestamp) continue
      const jobDate = new Date(job.timestamp)
      if (jobDate < cutoff) {
        await storage.delete(job._id)
        pruned++
      }
    }
    
    res.json({ ok: true, pruned, older_than_days: olderThanDays })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
