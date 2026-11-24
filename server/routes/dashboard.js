const { Router } = require("express")
const { getStorage } = require("../storage/adapter")
const { listServerPlugins } = require("../services/pluginsService")

const router = Router()

async function getDashboardData() {
  const storage = getStorage()

  const [commandKeys, mcpKeys, specKeys, jobKeys, clientKeys] = await Promise.all([
    storage.listKeys("command:"),
    storage.listKeys("mcp:"),
    storage.listKeys("spec:"),
    storage.listKeys("job:"),
    storage.listKeys("client:"),
  ])

  const [commands, mcpServers, specs, allJobs, allClients] = await Promise.all([
    Promise.all(commandKeys.map(k => storage.get(k))),
    Promise.all(mcpKeys.map(k => storage.get(k))),
    Promise.all(specKeys.map(k => storage.get(k))),
    Promise.all(jobKeys.map(k => storage.get(k))),
    Promise.all(clientKeys.map(k => storage.get(k))),
  ])

  let plugins = []
  try {
    plugins = await listServerPlugins()
  } catch (_) {}

  const validJobs = allJobs.filter(Boolean)
  const totalJobs = validJobs.length
  const successJobs = validJobs.filter(j => j.status === "success").length
  const failedJobs = validJobs.filter(j => j.status === "failed").length
  const successRate = totalJobs > 0 ? ((successJobs / totalJobs) * 100).toFixed(1) : "0.0"
  const failureRate = totalJobs > 0 ? ((failedJobs / totalJobs) * 100).toFixed(1) : "0.0"

  const avgDuration =
    totalJobs > 0
      ? Math.round(validJobs.reduce((sum, j) => sum + (j.duration_ms || 0), 0) / totalJobs)
      : 0

  const commandStats = {}
  for (const job of validJobs) {
    if (!job.command) continue
    if (!commandStats[job.command]) commandStats[job.command] = { count: 0, sum_ms: 0 }
    commandStats[job.command].count++
    commandStats[job.command].sum_ms += job.duration_ms || 0
  }

  const topCommands = Object.entries(commandStats)
    .map(([cmd, stats]) => ({
      command: cmd,
      count: stats.count,
      avg_ms: Math.round(stats.sum_ms / stats.count) || 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  const recentJobs = validJobs
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 10)

  // 7-day job trend
  const now = Date.now()
  const dayMs = 86400000
  const trend = []
  for (let i = 6; i >= 0; i--) {
    const dayStart = now - i * dayMs
    const dayEnd = dayStart + dayMs
    const label = new Date(dayStart).toLocaleDateString("en-US", { weekday: "short" })
    const dayJobs = validJobs.filter(j => {
      const t = new Date(j.timestamp).getTime()
      return t >= dayStart && t < dayEnd
    })
    trend.push({
      label,
      total: dayJobs.length,
      success: dayJobs.filter(j => j.status === "success").length,
      failed: dayJobs.filter(j => j.status === "failed").length,
    })
  }

  // Federation view: workers = job submitters aggregated by client_id, merged
  // with the client registry (heartbeats / plugin pushes). A worker is "live"
  // when it heartbeat or submitted a job within 3 sync cycles (~3 min).
  const clients = allClients.filter(Boolean)
  const clientById = {}
  for (const c of clients) if (c.client_id) clientById[c.client_id] = c

  const jobsByClient = {}
  for (const job of validJobs) {
    if (!job.client_id) continue
    const w = jobsByClient[job.client_id] || (jobsByClient[job.client_id] = { jobs: 0, failed: 0, last_job_at: null })
    w.jobs++
    if (job.status === "failed") w.failed++
    if (!w.last_job_at || new Date(job.timestamp) > new Date(w.last_job_at)) w.last_job_at = job.timestamp
  }

  const LIVE_WINDOW_MS = 3 * 60 * 1000
  const workerIds = new Set([...Object.keys(clientById), ...Object.keys(jobsByClient)])
  const workers = [...workerIds].map((id) => {
    const reg = clientById[id] || {}
    const j = jobsByClient[id] || { jobs: 0, failed: 0, last_job_at: null }
    const lastSeen = reg.last_seen || j.last_job_at
    return {
      client_id: id,
      hostname: reg.hostname || null,
      sc_version: reg.sc_version || null,
      live: !!lastSeen && Date.now() - new Date(lastSeen).getTime() < LIVE_WINDOW_MS,
      last_seen: lastSeen || null,
      jobs: j.jobs,
      failed_jobs: j.failed,
      plugins_pushed: !!reg.plugins,
    }
  }).sort((a, b) => new Date(b.last_seen || 0) - new Date(a.last_seen || 0))

  return {
    workers,
    counts: {
      commands: commands.filter(Boolean).length,
      mcpServers: mcpServers.filter(Boolean).length,
      specs: specs.filter(Boolean).length,
      plugins: plugins.length,
      pluginsEnabled: plugins.filter(p => p.enabled !== false).length,
    },
    jobs: {
      total: totalJobs,
      success: successJobs,
      failed: failedJobs,
      successRate,
      failureRate,
      avgDuration,
    },
    topCommands,
    recentJobs,
    trend,
  }
}

router.get("/", async (req, res) => {
  try {
    const data = await getDashboardData()
    if (req.query.format === "json") return res.json({ ok: true, ...data })
    res.render("dashboard", data)
  } catch (err) {
    res.status(500).send(err.message)
  }
})

module.exports = router
