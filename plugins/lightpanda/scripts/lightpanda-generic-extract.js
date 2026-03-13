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
const DEFAULT_WAIT_UNTIL = "domcontentloaded"

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
      args[trimmed.slice(0, eqIndex)] = trimmed.slice(eqIndex + 1)
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
  return Number.isNaN(parsed) || parsed <= 0 ? null : parsed
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
  const stdinCode = await readStdin()
  const hasCode = typeof args.code === "string" && args.code.trim() !== ""
  const hasFile = typeof args.file === "string" && args.file.trim() !== ""
  const hasStdin = stdinCode.trim() !== ""
  const providedCount = [hasCode, hasFile, hasStdin].filter(Boolean).length

  if (providedCount === 0) {
    throw createStructuredError(EXIT_CODES.invalidInput, "missing_script", "Provide extraction code with --code, --file, or stdin.", {
      suggestions: ["Pass inline code with --code or pipe script content on stdin."]
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
        suggestions: ["Pass an absolute path such as /home/user/extract.js."]
      })
    }
    return fs.readFileSync(path.resolve(args.file), "utf8")
  }
  return stdinCode
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

function drainStream(stream, verbose, label) {
  if (!stream) {
    return
  }
  if (verbose) {
    stream.on("data", (chunk) => {
      process.stderr.write(`[${label}] ${chunk.toString()}`)
    })
    return
  }
  stream.resume()
}

function loadRuntimeDependencies() {
  try {
    return {
      cheerio: require("cheerio"),
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

async function fetchHtml(url) {
  const response = await fetch(url, {
    headers: { "user-agent": "supercli-lightpanda-extract/0.1" },
    redirect: "follow"
  })
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`)
  }
  return { url: response.url, status: response.status, html: await response.text() }
}

function isRecoverableNavigationError(error) {
  const message = String(error && error.message ? error.message : error)
  return message.includes("Navigating frame was detached") || message.includes("Attempted to use detached Frame") || message.includes("PeerFailedVerification")
}

async function resilientGoto(page, url, options = {}) {
  const waitUntil = options.waitUntil || DEFAULT_WAIT_UNTIL
  const timeout = options.timeout || DEFAULT_NAVIGATION_TIMEOUT_MS
  const cheerio = options.cheerio
  try {
    const response = await page.goto(url, { waitUntil, timeout })
    const html = await page.content().catch(() => null)
    return {
      mode: "browser",
      requested_url: url,
      final_url: page.url(),
      status: response ? response.status() : null,
      html,
      $: html && cheerio ? cheerio.load(html) : null,
      error: null
    }
  } catch (error) {
    if (!isRecoverableNavigationError(error)) {
      throw error
    }
    const fallback = await fetchHtml(url)
    return {
      mode: "http_fallback",
      requested_url: url,
      final_url: fallback.url,
      status: fallback.status,
      html: fallback.html,
      $: cheerio ? cheerio.load(fallback.html) : null,
      error: error.message
    }
  }
}

async function closeBrowser(browser) {
  if (browser) {
    await browser.close().catch(() => {})
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
  } catch {}
  if (!proc.killed) {
    proc.kill("SIGTERM")
  }
}

async function executeUserCode(source, runtime) {
  const fn = new AsyncFunction(
    "browser",
    "page",
    "puppeteer",
    "lightpanda",
    "cheerio",
    "fetch",
    "context",
    "console",
    "$",
    "html",
    "resilientGoto",
    source
  )
  return fn(
    runtime.browser,
    runtime.page,
    runtime.puppeteer,
    runtime.lightpanda,
    runtime.cheerio,
    fetch,
    runtime.context,
    runtime.console,
    runtime.$,
    runtime.html,
    runtime.resilientGoto
  )
}

async function runCommand(rawArgs) {
  const args = parseArgs(rawArgs)
  const timeoutMs = toInteger(args["timeout-ms"], DEFAULT_TIMEOUT_MS)
  const navigationTimeoutMs = toInteger(args["navigation-timeout-ms"], DEFAULT_NAVIGATION_TIMEOUT_MS)
  const port = toInteger(args.port, DEFAULT_PORT)
  const host = typeof args.host === "string" ? args.host : DEFAULT_HOST
  const waitUntil = typeof args["wait-until"] === "string" ? args["wait-until"] : DEFAULT_WAIT_UNTIL
  const verbose = Boolean(args.verbose)

  if (!timeoutMs || !navigationTimeoutMs || !port) {
    throw createStructuredError(EXIT_CODES.invalidInput, "invalid_numeric_flag", "Numeric flags must be positive integers.", {
      suggestions: ["Check --timeout-ms, --navigation-timeout-ms, and --port."]
    })
  }

  const source = await loadCode(args)
  const deps = loadRuntimeDependencies()
  const endpoint = `ws://${host}:${port}`
  const startedAt = Date.now()
  let proc = null
  let browser = null
  let page = null
  let navigation = null

  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(createStructuredError(EXIT_CODES.timeout, "execution_timeout", `Execution exceeded ${timeoutMs}ms.`, {
        recoverable: true,
        suggestions: ["Retry with a larger --timeout-ms value."]
      }))
    }, timeoutMs)
  })

  try {
    proc = await withSuppressedStdout(verbose, () => deps.lightpanda.serve({ host, port }))
    drainStream(proc.stdout, verbose, "lightpanda:stdout")
    drainStream(proc.stderr, verbose, "lightpanda:stderr")
    browser = await deps.puppeteer.connect({ browserWSEndpoint: endpoint })
    page = await browser.newPage()
    page.setDefaultNavigationTimeout(navigationTimeoutMs)
    page.setDefaultTimeout(navigationTimeoutMs)

    if (typeof args.url === "string" && args.url.trim() !== "") {
      navigation = await resilientGoto(page, args.url, {
        waitUntil,
        timeout: navigationTimeoutMs,
        cheerio: deps.cheerio
      })
    }

    const result = await Promise.race([
      executeUserCode(source, {
        browser,
        page,
        puppeteer: deps.puppeteer,
        lightpanda: deps.lightpanda,
        cheerio: deps.cheerio,
        console: createAgentConsole(),
        $: navigation ? navigation.$ : null,
        html: navigation ? navigation.html : null,
        resilientGoto: async (url, extra = {}) => resilientGoto(page, url, {
          waitUntil,
          timeout: navigationTimeoutMs,
          cheerio: deps.cheerio,
          ...extra
        }),
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
          navigation,
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
        target_url: args.url || null,
        final_url: navigation ? navigation.final_url : null,
        extraction_mode: navigation ? navigation.mode : null,
        navigation_error: navigation ? navigation.error : null
      }
    })
  } finally {
    await closeBrowser(browser)
    await stopProcess(proc)
  }
}

async function main() {
  const [command, ...rest] = process.argv.slice(2)
  if (command !== "run") {
    throw createStructuredError(EXIT_CODES.invalidInput, "unknown_command", `Unknown command: ${command || "<missing>"}`, {
      suggestions: ["Use the 'run' command."]
    })
  }
  await runCommand(rest)
}

main().catch((error) => {
  if (!error.exitCode) {
    error.exitCode = EXIT_CODES.internalFailure
    error.errorType = "internal_failure"
    error.errorDetails = { stack: error.stack || null }
    error.errorSuggestions = ["Inspect the extraction script or retry with --verbose."]
  }
  printStructuredError(error)
  process.exit(error.exitCode)
})
