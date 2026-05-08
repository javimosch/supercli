# Lightpanda Resilient Navigation Skill

Some sites trigger Lightpanda navigation problems such as detached frames or TLS verification failures. The plugin handles those cases in extraction mode with `resilientGoto(...)`.

## Recoverable Browser Errors

The extraction runtime treats these as recoverable navigation failures:

- `Navigating frame was detached`
- `Attempted to use detached Frame`
- `PeerFailedVerification`

## What `resilientGoto(...)` Returns

`resilientGoto(url, options)` returns an object with:

- `mode`: `browser` or `http_fallback`
- `requested_url`
- `final_url`
- `status`
- `html`
- `$`
- `error`

## Example

```js
const pageData = await resilientGoto("https://example.com/contact")

return {
  mode: pageData.mode,
  finalUrl: pageData.final_url,
  title: pageData.$ ? pageData.$("title").first().text() : null,
  navigationError: pageData.error
}
```

## Guidance

- Prefer `extract run` when navigation stability matters.
- Inspect `context.navigation.mode` and `meta.extraction_mode` to understand whether the browser path or fallback path was used.
- If the browser path is required, run with `--verbose` and inspect stderr logs before deciding whether the target is currently unsupported by Lightpanda.

## Caveats

### SPA Targets Always Return Empty DOM via Browser Path

When `resilientGoto` uses the browser path on a SPA (Vue, React, Angular), the returned `html` and `$` reflect the pre-render shell. The framework mounts but does not render — `$('#app').children()` will be empty. This is not a navigation failure; `mode` still returns `browser`. Switch to the `http_fallback` path intentionally (or use the raw `fetch` binding) if you only need static HTML.

### Hash Fragment URLs Fail Silently

`resilientGoto('http://example.com/#/route')` encodes `#` as `%23` in the Lightpanda request, producing a broken navigation target. Always pass base URLs without hash fragments. Hash-based routing is a client-side concern that Lightpanda does not resolve.

### HTTP Fallback Does Not Execute JavaScript

When `resilientGoto` falls back to HTTP, the response is raw server-rendered HTML — identical to what `fetch()` would return. No JavaScript runs. If the page requires JS for meaningful content, neither path produces useful output.

### Timeout Applies to the Full resilientGoto Call

The `--timeout-ms` budget is shared across all `resilientGoto` calls in a single script run. A slow first-page navigation consuming most of the budget will cause subsequent calls to fail. Use `--timeout-ms` generously when multi-page crawling.
