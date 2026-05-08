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

## Caveats

### SPA / Client-Side Rendered Pages

`extract run` navigates with the browser and then exposes `$` / `html` from `page.content()`. For SPAs (Vue, React, Angular), `page.content()` reflects the pre-render HTML shell — the `$` instance operates on an empty app container, not the rendered component tree.

Prefer using the injected `fetch` to retrieve raw HTML from an endpoint and parsing it with cheerio manually when the target is a SPA:
```js
const resp = await fetch('http://localhost:8080/');
const html = await resp.text();
const $ = cheerio.load(html);
return { title: $('title').text(), hasApp: !!$('#app').length };
```

### resilientGoto Falls Back Silently

When `resilientGoto` falls back to HTTP, `pageData.mode` is `http_fallback` and `pageData.$` is populated from the raw HTTP response. Always check `pageData.mode` before using `pageData.$` to understand which path ran.

### Hash Fragment Navigation

Do not pass hash URLs (`#/route`) to `resilientGoto`. The `#` fragment is sent to Lightpanda as a literal path component and may be percent-encoded or ignored. Target hash-routed pages by fetching the base URL instead.
