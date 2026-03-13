# Lightpanda Plugin

Agent-friendly browser automation and extraction for SuperCLI using Lightpanda and `puppeteer-core`.

## What It Provides

- `lightpanda cli setup`: install the plugin-local runtime dependencies.
- `lightpanda script run`: run dynamic automation code with `browser`, `page`, and Lightpanda bindings.
- `lightpanda extract run`: run dynamic extraction code with browser context plus `cheerio`, `fetch`, `html`, `$`, and `resilientGoto(...)`.
- `lightpanda contacts discover`: run the opinionated multi-page contact discovery flow.

## Why This Plugin Exists

The plugin gives agents a deterministic browser workflow with:

- JSON-only stdout for success and error payloads.
- stderr-only logs and debugging output.
- semantic exit codes.
- resilient fallback to HTTP + Cheerio when Lightpanda navigation hits known issues such as detached frames or TLS verification failures.

## Setup

Install the runtime dependencies inside the plugin folder:

```bash
dcli lightpanda cli setup
```

This installs dependencies from `plugins/lightpanda/package.json` and keeps them local to the plugin.

## Commands

### `lightpanda script run`

Use this for general browser automation.

Example:

```bash
dcli lightpanda script run \
  --url https://example.com \
  --code "return { title: await page.title(), url: await page.url() }"
```

Injected bindings:

- `browser`
- `page`
- `puppeteer`
- `lightpanda`
- `context`
- `console`

### `lightpanda extract run`

Use this when the agent wants to extract structured data and may need a fallback HTML parser.

Example:

```bash
dcli lightpanda extract run \
  --url https://example.com \
  --code "return { heading: $('h1').first().text(), mode: context.navigation && context.navigation.mode }"
```

Additional injected bindings:

- `cheerio`
- `fetch`
- `html`
- `$`
- `resilientGoto(url, options)`

Response schema:

```json
{
  "version": "1.0",
  "status": "success",
  "data": {},
  "meta": {
    "execution_ms": 0,
    "endpoint": "ws://127.0.0.1:9222",
    "target_url": "https://example.com",
    "final_url": "https://example.com/",
    "extraction_mode": "browser",
    "navigation_error": null
  }
}
```

### `lightpanda contacts discover`

Use this when the goal is specifically to identify owner contact channels from a small set of likely pages.

Example:

```bash
dcli lightpanda contacts discover --url https://example.com --max-pages 5
```

It scans the landing page plus likely contact/about/legal pages and returns:

- emails
- `mailto:` links
- phones
- `tel:` links
- social profiles

## Skills

This plugin keeps all agent-facing skills inside `plugins/lightpanda/skills/`.

- `skills/quickstart/SKILL.md`: entry point for `plugins learn`
- `skills/generic-extraction.md`: patterns for `extract run`
- `skills/contact-discovery.md`: patterns for `contacts discover`
- `skills/resilient-navigation.md`: handling detached frames and fallback mode

## Troubleshooting

### `Navigating frame was detached`

Some sites trigger a Lightpanda/Puppeteer navigation failure during page load. In the extraction path, this plugin treats that as recoverable and falls back to HTTP + Cheerio.

Check these fields in the JSON response:

- `meta.extraction_mode`
- `meta.navigation_error`

### TLS or verification issues

Some hosts may trigger `PeerFailedVerification`. The generic extraction runner treats this as recoverable when possible and exposes the fallback mode in metadata.

### Need more debugging detail

Add `--verbose` to forward Lightpanda process logs to stderr.

## Stability Checklist

- keep stdout JSON-only; send logs, warnings, and debug output to stderr
- preserve semantic exit codes and structured JSON errors when updating wrappers
- re-test both `browser` and `http_fallback` paths after navigation changes
- verify `lightpanda extract run` still exposes `context.navigation`, `$`, `html`, and `resilientGoto(...)`
- verify `lightpanda contacts discover` still scans multiple likely contact pages and returns the same top-level schema
- run `node --check` on plugin scripts and re-validate `plugins/lightpanda/plugin.json` after edits
