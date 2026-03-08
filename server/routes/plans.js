const { Router } = require("express")
const { getDb } = require("../db")
const { createPlan } = require("../../cli/planner")

const router = Router()

// POST /api/plans — create a plan
router.post("/", async (req, res) => {
  try {
    const db = getDb()
    const { command, args, cmd } = req.body

    if (!cmd) {
      // Resolve command from DB
      const [namespace, resource, action] = command.split(".")
      const dbCmd = await db.collection("commands").findOne({ namespace, resource, action })
      if (!dbCmd) return res.status(404).json({ error: "Command not found" })
      const plan = createPlan(dbCmd, args || {})
      await db.collection("plans").insertOne(plan)
      return res.status(201).json(plan)
    }

    const plan = createPlan(cmd, args || {})
    await db.collection("plans").insertOne(plan)
    res.status(201).json(plan)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/plans — list recent plans
router.get("/", async (req, res) => {
  try {
    const db = getDb()
    const plans = await db.collection("plans")
      .find()
      .sort({ created_at: -1 })
      .limit(50)
      .toArray()
    res.json(plans)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/plans/:id — inspect plan
router.get("/:id", async (req, res) => {
  try {
    const db = getDb()
    const plan = await db.collection("plans").findOne({ plan_id: req.params.id })
    if (!plan) return res.status(404).json({ error: "Plan not found" })
    res.json(plan)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/plans/:id/execute — execute a stored plan
router.post("/:id/execute", async (req, res) => {
  try {
    const db = getDb()
    const plan = await db.collection("plans").findOne({ plan_id: req.params.id })
    if (!plan) return res.status(404).json({ error: "Plan not found" })
    if (plan.status !== "planned") {
      return res.status(400).json({ error: `Plan status is '${plan.status}', expected 'planned'` })
    }

    // Resolve command
    const [namespace, resource, action] = plan.command.split(".")
    const cmd = await db.collection("commands").findOne({ namespace, resource, action })
    if (!cmd) return res.status(404).json({ error: "Command no longer exists" })

    // Execute via adapter
    const { execute } = require("../../cli/executor")
    const start = Date.now()
    let result, status = "success"
    try {
      result = await execute(cmd, plan.args || {}, { server: `http://localhost:${process.env.PORT || 3000}` })
    } catch (err) {
      result = { error: err.message }
      status = "failed"
    }
    const duration = Date.now() - start

    // Update plan status
    await db.collection("plans").updateOne(
      { plan_id: req.params.id },
      { $set: { status, executed_at: new Date().toISOString(), duration_ms: duration } }
    )

    // Record job
    await db.collection("jobs").insertOne({
      command: plan.command,
      plan_id: plan.plan_id,
      args: plan.args,
      status,
      duration_ms: duration,
      timestamp: new Date().toISOString()
    })

    res.json({
      version: "1.0",
      plan_id: plan.plan_id,
      command: plan.command,
      status,
      duration_ms: duration,
      data: result
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/plans/:id — cancel plan
router.delete("/:id", async (req, res) => {
  try {
    const db = getDb()
    await db.collection("plans").deleteOne({ plan_id: req.params.id })
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
