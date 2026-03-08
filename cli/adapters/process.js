const { spawn, spawnSync } = require("child_process")

function toCliFlags(flags) {
  const args = []
  for (const [k, v] of Object.entries(flags)) {
    if (["human", "json", "compact"].includes(k) || k.startsWith("__")) continue
    if (v === false || v === undefined || v === null) continue
    if (Array.isArray(v)) {
      for (const item of v) {
        args.push(`--${k}`, String(item))
      }
      continue
    }
    if (v === true) args.push(`--${k}`)
    else if (typeof v === "object") args.push(`--${k}`, JSON.stringify(v))
    else args.push(`--${k}`, String(v))
  }
  return args
}

function preflightBinary(binary) {
  const r = spawnSync("which", [binary], { encoding: "utf-8", timeout: 3000 })
  if (r.error) {
    return { ok: false, reason: r.error.message }
  }
  return { ok: r.status === 0, reason: (r.stderr || "").trim() }
}

function buildSafetyViolation(details) {
  return Object.assign(new Error(`Operation rejected: Cannot run interactive command in a non-TTY environment. Use non-interactive flags instead.${details ? ` ${details}` : ""}`), {
    code: 91,
    type: "safety_violation",
    recoverable: false
  })
}

function detectInteractiveFlags(args, interactiveFlags) {
  const configured = new Set((interactiveFlags || []).map(f => String(f)))
  if (configured.size === 0) return []

  const hits = new Set()
  for (const token of args) {
    const value = String(token)
    if (configured.has(value)) {
      hits.add(value)
      continue
    }

    if (value.startsWith("--") && value.includes("=")) {
      const key = value.slice(0, value.indexOf("="))
      if (configured.has(key)) hits.add(key)
      continue
    }

    if (value.startsWith("-") && !value.startsWith("--") && value.length > 2) {
      for (const ch of value.slice(1)) {
        const shortFlag = `-${ch}`
        if (configured.has(shortFlag)) hits.add(shortFlag)
      }
    }
  }

  return [...hits]
}

function validateNonTtySafety(cfg, args) {
  const isTty = !!process.stdout.isTTY
  if (isTty) return

  if (cfg.requiresInteractive === true) {
    throw buildSafetyViolation("Command requires an interactive TTY session.")
  }

  const hits = detectInteractiveFlags(args, cfg.interactiveFlags)
  if (hits.length > 0) {
    throw buildSafetyViolation(`Blocked interactive flags: ${hits.join(", ")}.`)
  }
}

async function execute(cmd, flags) {
  const cfg = cmd.adapterConfig || {}
  const binary = cfg.command
  if (!binary) throw new Error("Process adapter requires adapterConfig.command")

  const baseArgs = Array.isArray(cfg.baseArgs) ? cfg.baseArgs.slice() : []
  const nonTtyBaseArgs = Array.isArray(cfg.nonTtyBaseArgs) ? cfg.nonTtyBaseArgs.slice() : []
  const passthroughMode = cfg.passthrough === true
  const positionalNames = Array.isArray(cfg.positionalArgs) ? cfg.positionalArgs : []
  const parsedAsJson = cfg.parseJson !== false
  const includeJsonFlag = cfg.jsonFlag || null
  const timeoutMs = Number(cfg.timeout_ms) > 0 ? Number(cfg.timeout_ms) : 15000
  const flagsBeforePositionals = cfg.flagsBeforePositionals === true || binary === "docker"
  const passthroughInteractive = passthroughMode && flags.__passthroughInteractive === true
  const cwd = typeof cfg.cwd === "string" ? cfg.cwd : undefined
  const env = (cfg.env && typeof cfg.env === "object") ? { ...process.env, ...cfg.env } : process.env

  const check = preflightBinary(binary)
  if (!check.ok) {
    const help = cfg.missingDependencyHelp || `Run: dcli plugins doctor`
    throw Object.assign(new Error(`Missing dependency '${binary}'. ${help}`), {
      code: 85,
      type: "invalid_argument",
      recoverable: false
    })
  }

  const remainingFlags = { ...flags }
  const args = [...baseArgs]
  if (!process.stdout.isTTY && nonTtyBaseArgs.length > 0) {
    args.push(...nonTtyBaseArgs)
  }

  if (passthroughMode) {
    const passthroughArgs = Array.isArray(flags.__rawArgs) ? flags.__rawArgs : []
    args.push(...passthroughArgs)
  } else {
    const positionalValues = []
    for (const name of positionalNames) {
      if (remainingFlags[name] !== undefined) {
        positionalValues.push(String(remainingFlags[name]))
        delete remainingFlags[name]
      }
    }

    const flagArgs = []
    if (includeJsonFlag) flagArgs.push(includeJsonFlag)
    flagArgs.push(...toCliFlags(remainingFlags))

    if (flagsBeforePositionals) args.push(...flagArgs, ...positionalValues)
    else args.push(...positionalValues, ...flagArgs)
  }

  validateNonTtySafety(cfg, args)

  return new Promise((resolve, reject) => {
    const child = spawn(binary, args, { stdio: passthroughInteractive ? "inherit" : ["ignore", "pipe", "pipe"], cwd, env })
    let out = ""
    let err = ""
    let settled = false

    const timer = setTimeout(() => {
      if (settled) return
      settled = true
      child.kill("SIGTERM")
      reject(Object.assign(new Error(`Process command timed out after ${timeoutMs}ms`), {
        code: 105,
        type: "integration_error",
        recoverable: true
      }))
    }, timeoutMs)

    if (!passthroughInteractive) {
      child.stdout.setEncoding("utf-8")
      child.stderr.setEncoding("utf-8")
      child.stdout.on("data", chunk => { out += chunk })
      child.stderr.on("data", chunk => { err += chunk })
    }

    child.on("error", e => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      if (e && e.code === "ENOENT") {
        const help = cfg.missingDependencyHelp || `Run: dcli plugins doctor`
        reject(Object.assign(new Error(`Missing dependency '${binary}'. ${help}`), {
          code: 85,
          type: "invalid_argument",
          recoverable: false
        }))
        return
      }
      reject(Object.assign(new Error(`Failed to start process adapter: ${e.message}`), {
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
        reject(Object.assign(new Error(`Process adapter failed (${binary} ${args.join(" ")}): ${err.trim()}`), {
          code: 105,
          type: "integration_error",
          recoverable: true
        }))
        return
      }

      if (passthroughInteractive) {
        resolve({ ok: true, passthrough: true })
        return
      }

      const text = out.trim()
      if (!parsedAsJson) {
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
