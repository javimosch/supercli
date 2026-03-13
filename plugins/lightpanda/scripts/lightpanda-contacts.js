const { URL } = require("url")

const VERSION = "1.0"
const EXIT_CODES = {
  success: 0,
  invalidInput: 80,
  invalidState: 90,
  integrationFailure: 100,
  timeout: 105,
  internalFailure: 110
}
const DEFAULT_TIMEOUT_MS = 45000
const DEFAULT_NAVIGATION_TIMEOUT_MS = 15000
const DEFAULT_HOST = "127.0.0.1"
const DEFAULT_PORT = 9222
const DEFAULT_MAX_PAGES = 5
const DEFAULT_WAIT_UNTIL = "domcontentloaded"
const EMAIL_REGEX = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/gi
const CONTACT_PAGE_HINTS = [
  "contact",
  "contactez",
  "contact-us",
  "nous-contacter",
  "about",
  "a-propos",
  "mentions-legales",
  "legal",
  "impressum"
]
const SOCIAL_HOSTS = {
  linkedin: ["linkedin.com"],
  x: ["x.com", "twitter.com"],
  facebook: ["facebook.com", "fb.com", "m.facebook.com"],
  instagram: ["instagram.com"],
  youtube: ["youtube.com", "youtu.be"],
  github: ["github.com"],
  tiktok: ["tiktok.com"],
  whatsapp: ["wa.me", "whatsapp.com"],
  telegram: ["t.me", "telegram.me", "telegram.org"]
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
    headers: {
      "user-agent": "supercli-lightpanda-extract/0.1"
    },
    redirect: "follow"
  })
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`)
  }
  return { url: response.url, html: await response.text() }
}

function normalizeUrl(value) {
  try {
    return new URL(value).toString()
  } catch (error) {
    throw createStructuredError(EXIT_CODES.invalidInput, "invalid_url", `Invalid URL: ${value}`, {
      suggestions: ["Pass a fully qualified URL such as https://example.com"]
    })
  }
}

function classifySocial(url) {
  const hostname = new URL(url).hostname.toLowerCase()
  for (const [network, hosts] of Object.entries(SOCIAL_HOSTS)) {
    if (hosts.some((host) => hostname === host || hostname.endsWith(`.${host}`))) {
      return network
    }
  }
  return null
}

function uniqueBy(items, keyFn) {
  const seen = new Set()
  const results = []
  for (const item of items) {
    const key = keyFn(item)
    if (seen.has(key)) {
      continue
    }
    seen.add(key)
    results.push(item)
  }
  return results
}

function rankCandidate(baseUrl, candidate) {
  let score = 0
  if (candidate.href === baseUrl) {
    score += 100
  }
  const haystack = `${candidate.href} ${candidate.text}`.toLowerCase()
  for (const hint of CONTACT_PAGE_HINTS) {
    if (haystack.includes(hint)) {
      score += 10
    }
  }
  if (candidate.href.includes("#")) {
    score -= 1
  }
  return score
}

async function extractFromPage(browser, url, navigationTimeoutMs) {
  const page = await browser.newPage()
  page.setDefaultNavigationTimeout(navigationTimeoutMs)
  page.setDefaultTimeout(navigationTimeoutMs)

  try {
    await page.goto(url, { waitUntil: DEFAULT_WAIT_UNTIL, timeout: navigationTimeoutMs })
    return await page.evaluate((contactHints) => {
    const clean = (value) => (value || "").replace(/\s+/g, " ").trim()
    const absolute = (value) => {
      try {
        return new URL(value, window.location.href).toString()
      } catch (error) {
        return null
      }
    }
    const anchors = Array.from(document.querySelectorAll("a[href]"))
    const links = anchors.map((anchor) => {
      const href = absolute(anchor.getAttribute("href"))
      return {
        href,
        text: clean(anchor.textContent),
        rel: clean(anchor.getAttribute("rel")),
        title: clean(anchor.getAttribute("title"))
      }
    }).filter((item) => item.href)

    const text = clean(document.body ? document.body.innerText : "")
    const emails = Array.from(new Set((text.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/gi) || []).map((value) => value.toLowerCase())))
    const phones = Array.from(new Set((text.match(/(?:\+\d{1,3}[\s./-]?)?(?:\(?\d{2,4}\)?[\s./-]?){2,5}\d{2,4}/g) || []).map((value) => clean(value)).filter((value) => value.replace(/\D/g, "").length >= 8)))

    const candidatePages = links.filter((link) => {
      const haystack = `${link.href} ${link.text} ${link.title}`.toLowerCase()
      return contactHints.some((hint) => haystack.includes(hint))
    })

    return {
      page_url: window.location.href,
      page_title: document.title,
      links,
      emails,
      phones,
      candidatePages
    }
    }, CONTACT_PAGE_HINTS)
  } finally {
    await page.close().catch(() => {})
  }
}

function extractFromHtml(cheerio, url, html) {
  const $ = cheerio.load(html)
  const clean = (value) => (value || "").replace(/\s+/g, " ").trim()
  const absolute = (value) => {
    try {
      return new URL(value, url).toString()
    } catch (error) {
      return null
    }
  }
  const links = $("a[href]").map((_, el) => ({
    href: absolute($(el).attr("href")),
    text: clean($(el).text()),
    rel: clean($(el).attr("rel")),
    title: clean($(el).attr("title"))
  })).get().filter((item) => item.href)
  const text = clean($("body").text())
  return {
    page_url: url,
    page_title: clean($("title").first().text()),
    links,
    emails: Array.from(new Set((text.match(EMAIL_REGEX) || []).map((value) => value.toLowerCase()))),
    phones: Array.from(new Set((text.match(/(?:\+\d{1,3}[\s./-]?)?(?:\(?\d{2,4}\)?[\s./-]?){2,5}\d{2,4}/g) || []).map((value) => clean(value)).filter((value) => value.replace(/\D/g, "").length >= 8))),
    candidatePages: links.filter((link) => {
      const haystack = `${link.href} ${link.text} ${link.title}`.toLowerCase()
      return CONTACT_PAGE_HINTS.some((hint) => haystack.includes(hint))
    })
  }
}

async function runExtraction(args) {
  const targetUrl = normalizeUrl(args.url)
  const timeoutMs = toInteger(args["timeout-ms"], DEFAULT_TIMEOUT_MS)
  const navigationTimeoutMs = toInteger(args["navigation-timeout-ms"], DEFAULT_NAVIGATION_TIMEOUT_MS)
  const maxPages = toInteger(args["max-pages"], DEFAULT_MAX_PAGES)
  const port = toInteger(args.port, DEFAULT_PORT)
  const host = typeof args.host === "string" ? args.host : DEFAULT_HOST
  const verbose = Boolean(args.verbose)

  if (!timeoutMs || !navigationTimeoutMs || !maxPages || !port) {
    throw createStructuredError(EXIT_CODES.invalidInput, "invalid_numeric_flag", "Numeric flags must be positive integers.", {
      suggestions: ["Check --timeout-ms, --navigation-timeout-ms, --max-pages, and --port."]
    })
  }

  const runtimeDeps = loadRuntimeDependencies()
  const endpoint = `ws://${host}:${port}`
  const startedAt = Date.now()
  let proc = null
  let browser = null

  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(createStructuredError(EXIT_CODES.timeout, "extraction_timeout", `Extraction exceeded ${timeoutMs}ms.`, {
        recoverable: true,
        suggestions: ["Retry with a larger --timeout-ms value or lower --max-pages."]
      }))
    }, timeoutMs)
  })

  try {
    const result = await Promise.race([
      (async () => {
        proc = await withSuppressedStdout(verbose, () => runtimeDeps.lightpanda.serve({ host, port }))
        drainStream(proc.stdout, verbose, "lightpanda:stdout")
        drainStream(proc.stderr, verbose, "lightpanda:stderr")

        browser = await runtimeDeps.puppeteer.connect({ browserWSEndpoint: endpoint })

        let rootData
        let extractionMode = "browser"
        try {
          rootData = await extractFromPage(browser, targetUrl, navigationTimeoutMs)
        } catch (error) {
          extractionMode = "http_fallback"
          const fallback = await fetchHtml(targetUrl)
          rootData = extractFromHtml(runtimeDeps.cheerio, fallback.url, fallback.html)
        }
        const origin = new URL(targetUrl).origin
        const candidates = uniqueBy(rootData.candidatePages, (item) => item.href)
          .filter((item) => item.href.startsWith(origin))
          .sort((left, right) => rankCandidate(targetUrl, right) - rankCandidate(targetUrl, left))
          .slice(0, Math.max(0, maxPages - 1))

        const visited = [rootData.page_url]
        const pages = [rootData]
        for (const candidate of candidates) {
          let candidateData
          try {
            candidateData = extractionMode === "browser"
              ? await extractFromPage(browser, candidate.href, navigationTimeoutMs)
              : null
          } catch (error) {
            extractionMode = "http_fallback"
          }
          if (!candidateData) {
            const fallback = await fetchHtml(candidate.href)
            candidateData = extractFromHtml(runtimeDeps.cheerio, fallback.url, fallback.html)
          }
          visited.push(candidateData.page_url)
          pages.push(candidateData)
        }

        const emails = uniqueBy(
          pages.flatMap((entry) => entry.emails.map((value) => ({ value, source_url: entry.page_url }))),
          (item) => item.value
        )
        const phones = uniqueBy(
          pages.flatMap((entry) => entry.phones.map((value) => ({ value, source_url: entry.page_url }))),
          (item) => item.value
        )

        const links = uniqueBy(
          pages.flatMap((entry) => entry.links.map((link) => ({ ...link, source_url: entry.page_url }))),
          (item) => `${item.source_url}:${item.href}`
        )
        const mailto = uniqueBy(
          links.filter((link) => link.href.startsWith("mailto:")).map((link) => ({
            value: link.href.replace(/^mailto:/i, "").split("?")[0],
            href: link.href,
            source_url: link.source_url
          })),
          (item) => item.value.toLowerCase()
        )
        const tel = uniqueBy(
          links.filter((link) => link.href.startsWith("tel:")).map((link) => ({
            value: link.href.replace(/^tel:/i, ""),
            href: link.href,
            source_url: link.source_url
          })),
          (item) => item.value
        )
        const social = uniqueBy(
          links.map((link) => {
            try {
              const network = classifySocial(link.href)
              return network ? { network, href: link.href, text: link.text, source_url: link.source_url } : null
            } catch (error) {
              return null
            }
          }).filter(Boolean),
          (item) => `${item.network}:${item.href}`
        )

        const contactPages = pages.map((entry) => ({ url: entry.page_url, title: entry.page_title }))
        return {
          target_url: targetUrl,
          visited_pages: visited,
          contact_channels: {
            emails,
            mailto,
            phones,
            tel,
            social
          },
          contact_pages: contactPages,
          meta: {
            execution_ms: Date.now() - startedAt,
            endpoint,
            pages_scanned: pages.length,
            extraction_mode: extractionMode
          }
        }
      })(),
      timeoutPromise
    ])

    printJson({ version: VERSION, status: "success", data: result })
  } finally {
    if (browser) {
      try {
        await browser.close()
      } catch (error) {
        process.stderr.write(`Failed to close browser: ${error.message}\n`)
      }
    }
    if (proc) {
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
      if (!proc.killed) {
        proc.kill("SIGTERM")
      }
    }
  }
}

async function main() {
  const [command, ...rest] = process.argv.slice(2)
  if (command !== "run") {
    throw createStructuredError(EXIT_CODES.invalidInput, "unknown_command", `Unknown command: ${command || "<missing>"}`, {
      suggestions: ["Use the 'run' command."]
    })
  }

  const args = parseArgs(rest)
  if (typeof args.url !== "string" || args.url.trim() === "") {
    throw createStructuredError(EXIT_CODES.invalidInput, "missing_url", "Provide a target URL with --url.", {
      suggestions: ["Example: dcli lightpanda extract run --url https://example.com"]
    })
  }

  await runExtraction(args)
}

main().catch((error) => {
  if (!error.exitCode) {
    error.exitCode = EXIT_CODES.internalFailure
    error.errorType = "internal_failure"
    error.errorDetails = { stack: error.stack || null }
    error.errorSuggestions = ["Inspect the extraction wrapper or retry with --verbose."]
  }
  printStructuredError(error)
  process.exit(error.exitCode)
})
