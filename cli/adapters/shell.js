const { spawn } = require("child_process")

function interpolateScript(script, flags) {
  let out = script
  for (const [k, v] of Object.entries(flags)) {
    if (["human", "json", "compact"].includes(k)) continue
    const value = String(v).replace(/"/g, '\\"')
    out = out.replaceAll(`{{${k}}}`, value)
  }
  return out
}

async function execute(cmd, flags) {
  const cfg = cmd.adapterConfig || {}
  const shellBin = cfg.shell || "bash"
  const script = interpolateScript(cfg.script, flags)
  const timeoutMs = Number(cfg.timeout_ms) > 0 ? Number(cfg.timeout_ms) : 15000
  const parseJson = cfg.parseJson !== false

  return new Promise((resolve, reject) => {
    const child = spawn(shellBin, ["-lc", script], {
      stdio: ["ignore", "pipe", "pipe"]
    })

    let stdout = ""
    let stderr = ""
    let settled = false

    const timer = setTimeout(() => {
      if (settled) return
      settled = true
      child.kill("SIGTERM")
      reject(Object.assign(new Error(`Shell command timed out after ${timeoutMs}ms`), {
        code: 105,
        type: "integration_error",
        recoverable: true
      }))
    }, timeoutMs)

    child.stdout.setEncoding("utf-8")
    child.stderr.setEncoding("utf-8")
    child.stdout.on("data", chunk => { stdout += chunk })
    child.stderr.on("data", chunk => { stderr += chunk })

    child.on("error", err => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      reject(Object.assign(new Error(`Failed to start shell adapter: ${err.message}`), {
        code: 105,
        type: "integration_error",
        recoverable: true
      }))
    })

    child.on("close", code => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      if (code !== 0) {
        reject(Object.assign(new Error(`Shell adapter failed (${shellBin} -lc ...): ${stderr.trim()}`), {
          code: 105,
          type: "integration_error",
          recoverable: true
        }))
        return
      }
      const text = stdout.trim()
      if (!parseJson) {
        resolve({ raw: text })
        return
      }
      try {
        resolve(text ? JSON.parse(text) : {})
      } catch {
        resolve({ raw: text })
      }
    })
  })
}

module.exports = { execute }
