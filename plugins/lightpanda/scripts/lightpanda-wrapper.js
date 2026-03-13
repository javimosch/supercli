const fs = require("fs")
const path = require("path")
const { Console } = require("console")

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor
const VERSION = "1.0"
const EXIT_CODES = {
  success: 0,
  invalidInput: 80,
  invalidState: 90,
  integrationFailure: 100,
  timeout: 105,
  internalFailure: 110
}
const DEFAULT_TIMEOUT_MS = 30000
const DEFAULT_NAVIGATION_TIMEOUT_MS = 15000
const DEFAULT_HOST = "127.0.0.1"
const DEFAULT_PORT = 9222
const HELP_JSON = {
  version: VERSION,
  name: "lightpanda-wrapper",
  description: "Agent-friendly Lightpanda runner with injected puppeteer-core browser and page objects.",
  commands: {
    run: {
      description: "Run dynamic automation code and emit pure JSON on stdout.",
      input_modes: ["--code", "--file", "stdin"],
      flags: {
        "--code": "JavaScript function body to execute",
        "--file": "Absolute path to a JavaScript file containing the function body",
        "--url": "Optional URL to visit before running the script",
        "--wait-until": "Navigation mode: load, domcontentloaded, networkidle0, networkidle2",
        "--timeout-ms": `Overall timeout in milliseconds (default: ${DEFAULT_TIMEOUT_MS})`,
        "--navigation-timeout-ms": `Navigation timeout in milliseconds (default: ${DEFAULT_NAVIGATION_TIMEOUT_MS})`,
        "--host": `Lightpanda bind host (default: ${DEFAULT_HOST})`,
        "--port": `Lightpanda bind port (default: ${DEFAULT_PORT})`,
        "--verbose": "Forward Lightpanda process logs to stderr"
      },
      injected_context: [
        "browser",
        "page",
        "puppeteer",
        "lightpanda",
        "context",
        "console"
      ],
      output_schema: {
        success: {
          version: VERSION,
          status: "success",
          data: "any",
          meta: {
            execution_ms: "number",
            endpoint: "string",
            navigated_url: "string|null"
          }
        },
        error: {
          version: VERSION,
          status: "error",
          error: {
            code: "number",
            type: "string",
            message: "string",
            recoverable: "boolean",
            suggestions: ["string"]
          }
        }
      },
      examples: [
        "dcli lightpanda script run --url https://example.com --code \"return { title: await page.title() }\"",
        "cat script.js | dcli lightpanda script run"
      ]
    }
  },
  exit_codes: {
    0: "success",
    80: "invalid_input",
    90: "invalid_state",
    100: "integration_failure",
    105: "timeout",
    110: "internal_failure"
  }
}

function parseArgs(argv) {
  const args = { _: [] }

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index]
    if (!token.startsWith("--")) {
      args._.push(token)
      continue
    }

    const trimmed = token.slice(2)
    const eqIndex = trimmed.indexOf("=")
    if (eqIndex >= 0) {
      const key = trimmed.slice(0, eqIndex)
      const value = trimmed.slice(eqIndex + 1)
      args[key] = value
      continue
    }

    const next = argv[index + 1]
    if (!next || next.startsWith("--")) {
      args[trimmed] = true
      continue
    }

    args[trimmed] = next
    index += 1
  }

  return args
}

function toInteger(value, fallback) {
  if (value === undefined) {
    return fallback
  }

  const parsed = Number.parseInt(String(value), 10)
  if (Number.isNaN(parsed) || parsed <= 0) {
    return null
  }

  return parsed
}

function printJson(payload) {
  process.stdout.write(`${JSON.stringify(payload)}\n`)
}

function createStructuredError(code, type, message, options = {}) {
  const error = new Error(message)
  error.exitCode = code
  error.errorType = type
  error.errorDetails = options.details || {}
  error.errorRecoverable = options.recoverable || false
  error.retryAfter = options.retry_after || null
  error.errorSuggestions = options.suggestions || []
  return error
}

function printStructuredError(error) {
  printJson({
    version: VERSION,
    status: "error",
    error: {
      code: error.exitCode || EXIT_CODES.internalFailure,
      type: error.errorType || "internal_failure",
      message: error.message,
      details: error.errorDetails || {},
      recoverable: error.errorRecoverable || false,
      retry_after: error.retryAfter || null,
      suggestions: error.errorSuggestions || []
    }
  })
}

function createAgentConsole() {
  return new Console({ stdout: process.stderr, stderr: process.stderr, colorMode: false })
}

function drainStream(stream, verbose, label) {
  if (!stream) {
    return
  }

  if (verbose) {
    stream.on("data", (chunk) => {
      const text = chunk.toString()
      process.stderr.write(`[${label}] ${text}`)
    })
    return
  }

  stream.resume()
}

async function withSuppressedStdout(verbose, fn) {
  const originalWrite = process.stdout.write.bind(process.stdout)
  process.stdout.write = (chunk, encoding, callback) => {
    const text = Buffer.isBuffer(chunk) ? chunk.toString(typeof encoding === "string" ? encoding : undefined) : String(chunk)
    if (verbose && text.trim() !== "") {
      process.stderr.write(text)
    }

    if (typeof encoding === "function") {
      encoding()
    } else if (typeof callback === "function") {
      callback()
    }
    return true
  }

  try {
    return await fn()
  } finally {
    process.stdout.write = originalWrite
  }
}

async function readStdin() {
  if (process.stdin.isTTY) {
    return ""
  }

  const chunks = []
  for await (const chunk of process.stdin) {
    chunks.push(chunk)
  }
  return Buffer.concat(chunks).toString("utf8")
}

async function loadCode(args) {
  const hasCode = typeof args.code === "string" && args.code.trim() !== ""
  const hasFile = typeof args.file === "string" && args.file.trim() !== ""
  const stdinCode = await readStdin()
  const hasStdin = stdinCode.trim() !== ""

  const providedCount = [hasCode, hasFile, hasStdin].filter(Boolean).length
  if (providedCount === 0) {
    throw createStructuredError(EXIT_CODES.invalidInput, "missing_script", "Provide automation code with --code, --file, or stdin.", {
      suggestions: [
        "Pass inline code with --code \"return await page.title()\"",
        "Pass a file with --file /absolute/path/to/script.js"
      ]
    })
  }

  if (providedCount > 1) {
    throw createStructuredError(EXIT_CODES.invalidInput, "ambiguous_script", "Use only one script input source: --code, --file, or stdin.", {
      suggestions: ["Choose a single input mode and retry."]
    })
  }

  if (hasCode) {
    return args.code
  }

  if (hasFile) {
    if (!path.isAbsolute(args.file)) {
      throw createStructuredError(EXIT_CODES.invalidInput, "script_not_absolute", `Script path must be absolute: ${args.file}`, {
        suggestions: ["Pass an absolute path such as /home/user/script.js."]
      })
    }

    const scriptPath = path.resolve(args.file)
    if (!fs.existsSync(scriptPath)) {
      throw createStructuredError(EXIT_CODES.invalidInput, "script_not_found", `Script file not found: ${args.file}`, {
        suggestions: ["Use an absolute path to an existing .js file."]
      })
    }
    return fs.readFileSync(scriptPath, "utf8")
  }

  return stdinCode
}

async function closeBrowser(browser) {
  if (!browser) {
    return
  }

  try {
    await browser.close()
  } catch (error) {
    process.stderr.write(`Failed to close browser: ${error.message}\n`)
  }
}

async function stopProcess(proc) {
  if (!proc) {
    return
  }

  try {
    if (proc.stdout) {
      proc.stdout.destroy()
    }
    if (proc.stderr) {
      proc.stderr.destroy()
    }
  } catch (error) {
    process.stderr.write(`Failed to close Lightpanda streams: ${error.message}\n`)
  }

  if (proc.killed) {
    return
  }

  proc.kill("SIGTERM")
  await new Promise((resolve) => {
    const timer = setTimeout(() => {
      try {
        if (!proc.killed) {
          proc.kill("SIGKILL")
        }
      } catch (error) {
        process.stderr.write(`Failed to force-stop Lightpanda: ${error.message}\n`)
      }
      resolve()
    }, 1000)

    proc.once("exit", () => {
      clearTimeout(timer)
      resolve()
    })
  })
}

async function executeUserCode(source, runtime) {
  const fn = new AsyncFunction(
    "browser",
    "page",
    "puppeteer",
    "lightpanda",
    "context",
    "console",
    source
  )

  return fn(
    runtime.browser,
    runtime.page,
    runtime.puppeteer,
    runtime.lightpanda,
    runtime.context,
    runtime.console
  )
}

function loadRuntimeDependencies() {
  try {
    return {
      lightpanda: require("@lightpanda/browser").lightpanda,
      puppeteer: require("puppeteer-core")
    }
  } catch (error) {
    throw createStructuredError(EXIT_CODES.invalidState, "missing_runtime_dependencies", "Lightpanda runtime dependencies are not installed.", {
      details: { message: error.message },
      suggestions: ["Run 'dcli lightpanda cli setup' and retry."]
    })
  }
}

async function runCommand(rawArgs) {
  const args = parseArgs(rawArgs)
  const timeoutMs = toInteger(args["timeout-ms"], DEFAULT_TIMEOUT_MS)
  const navigationTimeoutMs = toInteger(args["navigation-timeout-ms"], DEFAULT_NAVIGATION_TIMEOUT_MS)
  const port = toInteger(args.port, DEFAULT_PORT)
  const host = typeof args.host === "string" ? args.host : DEFAULT_HOST
  const waitUntil = typeof args["wait-until"] === "string" ? args["wait-until"] : "domcontentloaded"
  const verbose = Boolean(args.verbose)
  const allowedWaitUntil = new Set(["load", "domcontentloaded", "networkidle0", "networkidle2"])

  if (!timeoutMs || !navigationTimeoutMs || !port) {
    throw createStructuredError(EXIT_CODES.invalidInput, "invalid_numeric_flag", "Numeric flags must be positive integers.", {
      suggestions: ["Check --timeout-ms, --navigation-timeout-ms, and --port."]
    })
  }

  if (!allowedWaitUntil.has(waitUntil)) {
    throw createStructuredError(EXIT_CODES.invalidInput, "invalid_wait_until", `Unsupported waitUntil value: ${waitUntil}`, {
      suggestions: ["Use load, domcontentloaded, networkidle0, or networkidle2."]
    })
  }

  const source = await loadCode(args)
  const runtimeDeps = loadRuntimeDependencies()
  const endpoint = `ws://${host}:${port}`
  const startedAt = Date.now()
  let browser = null
  let page = null
  let proc = null

  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(Object.assign(new Error(`Execution exceeded ${timeoutMs}ms.`), { exitCode: EXIT_CODES.timeout, errorType: "execution_timeout" }))
    }, timeoutMs)
  })

  try {
    proc = await withSuppressedStdout(verbose, () => runtimeDeps.lightpanda.serve({ host, port }))
    drainStream(proc.stdout, verbose, "lightpanda:stdout")
    drainStream(proc.stderr, verbose, "lightpanda:stderr")

    browser = await runtimeDeps.puppeteer.connect({ browserWSEndpoint: endpoint })
    page = await browser.newPage()
    page.setDefaultNavigationTimeout(navigationTimeoutMs)
    page.setDefaultTimeout(navigationTimeoutMs)

    if (typeof args.url === "string" && args.url.trim() !== "") {
      await page.goto(args.url, { waitUntil, timeout: navigationTimeoutMs })
    }

    const result = await Promise.race([
      executeUserCode(source, {
        browser,
        page,
        puppeteer: runtimeDeps.puppeteer,
        lightpanda: runtimeDeps.lightpanda,
        console: createAgentConsole(),
        context: {
          args: {
            url: args.url || null,
            waitUntil,
            timeoutMs,
            navigationTimeoutMs,
            host,
            port
          },
          endpoint,
          startedAt: new Date(startedAt).toISOString()
        }
      }),
      timeoutPromise
    ])

    printJson({
      version: VERSION,
      status: "success",
      data: result,
      meta: {
        execution_ms: Date.now() - startedAt,
        endpoint,
        navigated_url: args.url || null
      }
    })
    process.exitCode = EXIT_CODES.success
  } catch (error) {
    if (!error.exitCode) {
      error.exitCode = EXIT_CODES.integrationFailure
      error.errorType = "script_execution_failed"
      error.errorRecoverable = true
      error.errorDetails = {
        stack: error.stack || null
      }
      error.errorSuggestions = [
        "Check the script body for syntax/runtime errors.",
        "Retry with --verbose to inspect Lightpanda process logs."
      ]
    }

    throw error
  } finally {
    await closeBrowser(browser)
    await stopProcess(proc)
  }
}

async function main() {
  const [command, ...rest] = process.argv.slice(2)

  if (command === "help-json") {
    printJson(HELP_JSON)
    return
  }

  if (command !== "run") {
    throw createStructuredError(EXIT_CODES.invalidInput, "unknown_command", `Unknown command: ${command || "<missing>"}`, {
      suggestions: ["Use the 'run' command or 'help-json' for schema discovery."]
    })
  }

  await runCommand(rest)
}

main().catch((error) => {
  if (!error.exitCode) {
    error.exitCode = EXIT_CODES.internalFailure
    error.errorType = "internal_failure"
    error.errorDetails = { stack: error.stack || null }
    error.errorSuggestions = ["Inspect the wrapper implementation or rerun with a simpler script."]
  }

  printStructuredError(error)
  process.exit(error.exitCode)
})
