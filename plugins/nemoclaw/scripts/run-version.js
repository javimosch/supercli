const { spawnSync } = require("child_process")

function run() {
  const primary = spawnSync("nemoclaw", ["--version"], { encoding: "utf-8", timeout: 15000 })
  if (!primary.error && primary.status === 0) {
    process.stdout.write((primary.stdout || "").trim())
    return process.exit(0)
  }

  const fallback = spawnSync("nemoclaw", ["help"], { encoding: "utf-8", timeout: 15000 })
  if (fallback.error) {
    process.stderr.write(`${fallback.error.message}\n`)
    return process.exit(1)
  }
  if (fallback.status !== 0) {
    process.stderr.write((fallback.stderr || "").trim() || `exit ${fallback.status}`)
    return process.exit(typeof fallback.status === "number" ? fallback.status : 1)
  }

  const text = (fallback.stdout || "").trim()
  const first = text.split("\n").find(Boolean) || "nemoclaw (version unavailable)"
  process.stdout.write(first)
  return process.exit(0)
}

if (require.main === module) {
  run()
}

module.exports = {
  run
}
