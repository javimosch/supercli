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
