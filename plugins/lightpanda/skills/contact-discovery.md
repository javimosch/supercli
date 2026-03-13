# Lightpanda Contact Discovery Skill

Use `dcli lightpanda contacts discover` when the goal is to identify ways to reach the owner of a site.

## What It Does

The contact discovery flow:

- starts from the target URL
- ranks likely contact/about/legal pages
- scans a small number of pages
- collects contact channels into one structured result

## Example

```bash
dcli lightpanda contacts discover --url https://example.com --max-pages 5
```

## Output Highlights

Important fields in `data`:

- `target_url`
- `visited_pages`
- `contact_channels.emails`
- `contact_channels.mailto`
- `contact_channels.phones`
- `contact_channels.tel`
- `contact_channels.social`
- `contact_pages`
- `meta.extraction_mode`

## When To Use This Instead Of `extract run`

Use `contacts discover` when:

- the task is specifically owner outreach or contact finding
- you want the built-in multi-page crawl
- you do not need custom extraction logic

Use `extract run` when:

- you need a custom schema
- you need to visit arbitrary extra pages
- you want to combine browser and HTML-first parsing yourself

## Notes

- The crawler may return `http_fallback` mode if browser navigation is unstable for the target site.
- Social links are normalized into known networks such as Facebook, LinkedIn, X, Instagram, WhatsApp, and Telegram.
