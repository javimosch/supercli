# Lightpanda Generic Extraction Skill

Use `dcli lightpanda extract run` when the agent should supply custom extraction logic but still benefit from resilient navigation and HTML fallback.

## What You Get

The extraction runtime injects:

- `browser`
- `page`
- `puppeteer`
- `lightpanda`
- `cheerio`
- `fetch`
- `context`
- `console`
- `$`
- `html`
- `resilientGoto(url, options)`

## Best Pattern

If you pass `--url`, start by using the preloaded `$` or `html` for extraction and only call `resilientGoto(...)` for additional pages.

Example:

```bash
dcli lightpanda extract run \
  --url https://example.com \
  --code "return { title: $('title').first().text(), links: $('a').length }"
```

## Response Contract

Your return value becomes `data`.

Metadata is always added as `meta`:

- `execution_ms`
- `endpoint`
- `target_url`
- `final_url`
- `extraction_mode`
- `navigation_error`

## Multi-Page Pattern

Use `resilientGoto(...)` for secondary pages:

```js
const contact = await resilientGoto("https://example.com/contact")

return {
  homepageTitle: $("title").first().text(),
  contactMode: contact.mode,
  contactMailto: contact.$
    ? contact.$('a[href^="mailto:"]').map((_, el) => contact.$(el).attr("href")).get()
    : []
}
```

## Notes

- `console.log(...)` goes to stderr.
- Prefer returning small, structured objects.
- If `context.navigation` is `null`, your run started without `--url`.
