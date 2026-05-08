# Lightpanda Skill

Use Lightpanda through `dcli` when you need fast, headless browser automation with structured JSON output for agents.

## Skill Map

Use the plugin-local skills directory for focused guidance:

- `plugins/lightpanda/skills/generic-extraction.md`
- `plugins/lightpanda/skills/contact-discovery.md`
- `plugins/lightpanda/skills/resilient-navigation.md`

## Quick Start

### 1. Setup
Install the local runtime dependencies for the plugin:
```bash
dcli lightpanda cli setup
```

### 2. Inspect Wrapper Capabilities
Get machine-readable command help:
```bash
dcli lightpanda cli help-json
```

### 3. Run an Inline Script
Visit a page and return structured data:
```bash
dcli lightpanda script run \
  --url https://example.com \
  --code "return { title: await page.title(), url: await page.url() }"
```

### 4. Run a File-Based Script
Execute a script from an absolute file path:
```bash
dcli lightpanda script run --file /absolute/path/to/script.js
```

### 5. Pipe Script Content Through Stdin
Compose the wrapper with other tools:
```bash
cat /absolute/path/to/script.js | dcli lightpanda script run
```

### 6. Run a Generic Extraction
Use the extraction runner when the agent should supply dynamic extraction code:
```bash
dcli lightpanda extract run \
  --url https://example.com \
  --code "return { heading: $('h1').first().text(), mode: context.navigation?.mode }"
```

### 7. Discover Contact Channels
Use the opinionated multi-page discovery flow when the goal is to find owner contact channels:
```bash
dcli lightpanda contacts discover --url https://example.com --max-pages 5
```

## Choosing The Right Command

- Use `script run` for general browser automation.
- Use `extract run` for data extraction with `cheerio`, `fetch`, `$`, `html`, and `resilientGoto(...)`.
- Use `contacts discover` for the focused contact-channel crawler.

## Injected Runtime
Your script receives these bindings automatically:
- `browser`: connected `puppeteer-core` browser instance.
- `page`: a new page created for the run.
- `puppeteer`: the imported `puppeteer-core` module.
- `lightpanda`: the imported `@lightpanda/browser` module.
- `cheerio`: server-side HTML parser for fallback or HTML-first extraction.
- `fetch`: built-in fetch for direct HTTP retrieval.
- `context`: metadata about the run (`endpoint`, `args`, `startedAt`).
- `console`: stderr-backed console for debug logs that will not corrupt JSON stdout.
- `$`: a Cheerio instance for the current HTML when `extract run` navigates or falls back successfully.
- `html`: the HTML string paired with `$` in `extract run`.
- `resilientGoto(url, options)`: navigation helper that falls back to HTTP + Cheerio when Lightpanda hits frame-detached or TLS issues.

## Script Pattern
Write the body as if it lives inside an async function:
```js
await page.goto("https://news.ycombinator.com")

const posts = await page.evaluate(() => {
  return Array.from(document.querySelectorAll(".titleline > a")).slice(0, 5).map((link) => ({
    title: link.textContent,
    href: link.href
  }))
})

return posts
```

## Agent Notes
- The wrapper is non-interactive by default.
- Stdout is reserved for one JSON payload.
- Use `console.log(...)` inside the script for diagnostics; those logs go to stderr.
- Use `--verbose` when you need Lightpanda process logs on stderr.
- Use `--timeout-ms` to cap long runs and keep automation deterministic.
- `extract run` returns your custom `data` plus `meta` fields like `execution_ms`, `extraction_mode`, `target_url`, and `navigation_error`.
- `contacts discover` scans the landing page plus a small set of likely contact/about/legal pages and returns emails, phones, `mailto:`, `tel:`, and social links.

## Known Caveats and Pitfalls

### CWD Dependency — scripts/ Must Exist in Your Working Directory

`dcli lightpanda script run` resolves `scripts/lightpanda-wrapper.js` relative to the **current working directory**, not the plugin directory. Running from any project folder without a `scripts/` subdirectory fails immediately with `MODULE_NOT_FOUND`.

Fix: symlink the plugin scripts into your working directory before running:
```bash
ln -sf ~/ai/supercli/plugins/lightpanda/scripts ./scripts
```

### Lightpanda Does Not Fully Execute Modern JavaScript SPAs

Vue, React, and Angular apps typically mount (the root element receives framework attributes like `data-v-app`) but components do not render and router navigation does not fire. `page.content()` and `page.evaluate()` return the pre-render shell, not the rendered DOM.

Use `fetch()` inside your script to assert on static HTML structure instead:
```js
const resp = await fetch('http://localhost:8080/');
const html = await resp.text();
return { status: resp.status, hasApp: html.includes('id="app"') };
```

### Hash URLs Are Percent-Encoded by page.goto()

Passing `http://example.com/#/path` to `page.goto()` encodes `#` as `%23`, producing a broken navigation target. Navigate to the base URL only and let the SPA handle hash routing — or test hash-route logic via unit tests instead.

### waitUntil and setTimeout Do Not Fix SPA Rendering

`networkidle0` and added `setTimeout` delays do not unblock SPA rendering when Lightpanda does not execute the full JavaScript bundle. The navigation resolves but the DOM stays in its initial mount state regardless of how long you wait.

### page.title() Returns Static HTML Title Only

Dynamically updated titles (`document.title = ...` from JavaScript) are not reflected. Only the static `<title>` tag value from the served HTML is returned.

### Default Timeout Is 15 000 ms

Hitting the timeout produces an `integration_error` with exit code 105. Increase with `--timeout-ms` for slow targets — but note that SPA rendering failures are not timing problems; more time does not fix them.
