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

function parseJsonLine(text) {
  try {
    return JSON.parse(text)
  } catch {
    return { raw: text }
  }
}

function flushStreamBuffer(buffer, onLine) {
  let pending = buffer
  let newlineIndex = pending.indexOf("\n")
  while (newlineIndex >= 0) {
    const line = pending.slice(0, newlineIndex).trim()
    pending = pending.slice(newlineIndex + 1)
    if (line) onLine(line)
    newlineIndex = pending.indexOf("\n")
  }
  return pending
}

function normalizeErrorMatchers(cfg) {
  return Array.isArray(cfg.errorMatchers) ? cfg.errorMatchers.filter(Boolean) : []
}

function applyErrorMatchers(message, errorText, parsedError, cfg) {
  const haystack = [message, errorText]
  if (parsedError && parsedError.error && parsedError.error.message) haystack.push(parsedError.error.message)
  if (parsedError && parsedError.message) haystack.push(parsedError.message)
  const source = haystack.filter(Boolean).join("\n")

  for (const matcher of normalizeErrorMatchers(cfg)) {
    if (!matcher || !matcher.match) continue
    let regex = null
    try {
      regex = new RegExp(String(matcher.match), matcher.flags || "")
    } catch {
      continue
    }
    if (!regex.test(source)) continue
    return {
      message: matcher.message || message,
      code: Number.isInteger(matcher.code) ? matcher.code : undefined,
      type: matcher.type,
      recoverable: typeof matcher.recoverable === "boolean" ? matcher.recoverable : undefined,
      suggestions: Array.isArray(matcher.suggestions) ? matcher.suggestions : undefined
    }
  }

  return null
}

function resolveCwd(cfg, cmd) {
  if (cfg.cwd === "invoke_cwd") return process.cwd()
  if (cfg.cwd === "plugin_dir") return cmd.plugin_dir || undefined
  if (typeof cfg.cwd === "string" && cfg.cwd.trim()) return cfg.cwd
  return cmd.plugin_dir || undefined
}

async function execute(cmd, flags, context = {}) {
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
  const cwd = resolveCwd(cfg, cmd)
  const pluginEnv = {}
  if (cmd.plugin_dir) pluginEnv.SUPERCLI_PLUGIN_DIR = cmd.plugin_dir
  if (cmd.plugin_name) pluginEnv.SUPERCLI_PLUGIN_NAME = cmd.plugin_name
  pluginEnv.SUPERCLI_INVOKE_CWD = process.cwd()
  const env = (cfg.env && typeof cfg.env === "object") ? { ...process.env, ...cfg.env, ...pluginEnv } : { ...process.env, ...pluginEnv }
  const streamMode = cfg.stream || null
  const onStreamEvent = typeof context.onStreamEvent === "function" ? context.onStreamEvent : null

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
    let streamBuffer = ""
    let streamEventCount = 0
    let lastStreamEvent = null
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
      child.stdout.on("data", chunk => {
        out += chunk
        if (streamMode !== "jsonl") return
        streamBuffer = flushStreamBuffer(streamBuffer + chunk, line => {
          const event = parseJsonLine(line)
          streamEventCount += 1
          lastStreamEvent = event
          if (onStreamEvent) onStreamEvent(event)
        })
      })
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
        const errorText = err.trim()
        let parsedError = null
        try {
          const possibleJson = errorText.match(/\{.*\}/s)
          if (possibleJson) {
            parsedError = JSON.parse(possibleJson[0])
          }
        } catch {
          // ignore
        }

        const baseMsg = `Process adapter failed (${binary} ${args.join(" ")})`
        const finalMsg = parsedError && parsedError.error && parsedError.error.message
          ? parsedError.error.message
          : (parsedError && parsedError.message ? parsedError.message : errorText || baseMsg)
        const matchedError = applyErrorMatchers(finalMsg, errorText, parsedError, cfg)

        const errorObj = Object.assign(new Error(finalMsg), {
          code: (parsedError && parsedError.error && parsedError.error.code) || (parsedError && parsedError.code) || 105,
          type: (parsedError && parsedError.error && parsedError.error.type) || (parsedError && parsedError.type) || "integration_error",
          recoverable: (parsedError && parsedError.error && typeof parsedError.error.recoverable === "boolean") 
            ? parsedError.error.recoverable 
            : ((parsedError && typeof parsedError.recoverable === "boolean") ? parsedError.recoverable : true),
          suggestions: (parsedError && parsedError.error && Array.isArray(parsedError.error.suggestions))
            ? parsedError.error.suggestions
            : (Array.isArray(parsedError && parsedError.suggestions) ? parsedError.suggestions : [])
        })

        if (matchedError) {
          if (matchedError.message) errorObj.message = matchedError.message
          if (matchedError.code !== undefined) errorObj.code = matchedError.code
          if (matchedError.type) errorObj.type = matchedError.type
          if (matchedError.recoverable !== undefined) errorObj.recoverable = matchedError.recoverable
          if (matchedError.suggestions) errorObj.suggestions = matchedError.suggestions
        }

        reject(errorObj)
        return
      }

      if (passthroughInteractive) {
        resolve({ ok: true, passthrough: true })
        return
      }

      if (streamMode === "jsonl") {
        const trailing = streamBuffer.trim()
        if (trailing) {
          const event = parseJsonLine(trailing)
          streamEventCount += 1
          lastStreamEvent = event
          if (onStreamEvent) onStreamEvent(event)
        }
        resolve({
          streamed: true,
          stream: streamMode,
          event_count: streamEventCount,
          last_event: lastStreamEvent
        })
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
