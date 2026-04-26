const { Router } = require("express")
const { getStorage } = require("../storage/adapter")
const { listServerPlugins } = require("../services/pluginsService")

const router = Router()

async function getDashboardData() {
  const storage = getStorage()

  const [commandKeys, mcpKeys, specKeys, jobKeys] = await Promise.all([
    storage.listKeys("command:"),
    storage.listKeys("mcp:"),
    storage.listKeys("spec:"),
    storage.listKeys("job:"),
  ])

  const [commands, mcpServers, specs, allJobs] = await Promise.all([
    Promise.all(commandKeys.map(k => storage.get(k))),
    Promise.all(mcpKeys.map(k => storage.get(k))),
    Promise.all(specKeys.map(k => storage.get(k))),
    Promise.all(jobKeys.map(k => storage.get(k))),
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

  return {
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
    res.render("dashboard", data)
  } catch (err) {
    res.status(500).send(err.message)
  }
})

module.exports = router
