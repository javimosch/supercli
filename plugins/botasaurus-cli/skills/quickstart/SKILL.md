---
name: botasaurus-cli
description: Use this skill when the user needs to scrape a web page, check if a URL is accessible, or extract content from behind Cloudflare protection using the command line.
---

# botasaurus-cli — Web Scraping CLI

Scrape web pages from the command line with Cloudflare bypass and anti-detect HTTP requests. Wraps Botasaurus (omkarcloud/botasaurus, 4.7k ⭐, MIT).

## Installation

```bash
pip install botasaurus          # Core scraping engine (~14MB deps)
pip install botasaurus-cli      # CLI wrapper
```

First run auto-downloads `@request` dependencies (~14MB).

## Commands

- `botasaurus-cli web scrape <url> [--json]` — Scrape a URL
- `botasaurus-cli web check <url> [--json]` — Check if URL is accessible
- `botasaurus-cli self version` — Show engine info

## Critical Caveats & Pitfalls

### 1. First Run: Dependency Download
The first `scrape` or `check` call downloads the botasaurus_requests library (~14MB).
**Always warn the user** about this before running for the first time.

```
Downloading @request dependencies...
100% ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 13.8/13.8 MB
```

Takes 10-30 seconds depending on connection. Subsequent calls are instant.

### 2. Python ctypes Requirement
Botasaurus requires Python with `ctypes` support. Some Python installations (e.g., certain pyenv builds, system Python on some distros) lack `_ctypes` and will fail with:
```
ModuleNotFoundError: No module named '_ctypes'
```
**Fix**: Use a different Python version (`python3.10` usually works). The CLI auto-detects the correct Python.

### 3. First Run Timeout
The first scrape/check can take 15-30 seconds due to dependency download + setup.
Set `timeout_ms` high enough (120000+ recommended) when calling via supercli.

### 4. Cloudflare Bypass is Best-Effort
Botasaurus's `@request` decorator handles basic Cloudflare challenges (Connection Challenge via Google Referrer).
It may NOT bypass:
- JS with Captcha challenges (need `@browser` with `bypass_cloudflare=True`)
- Complex WAF rules (Datadome, PerimeterX)
- Turnstile CAPTCHAs

**If a URL fails**: Suggest trying with a browser-based tool or direct curl.

### 5. No Browser Rendering
`botasaurus-cli` uses the `@request` decorator which sends HTTP requests, not a full browser.
It will NOT execute JavaScript or render SPAs (React, Vue, etc.).
For JS-heavy sites, use the full Botasaurus framework with `@browser` decorator.

### 6. Output Format
- Default: human-readable summary (URL, status, title, size)
- `--json`: structured JSON with all fields
- Title extraction uses BeautifulSoup (`soupify`) — only works for HTML pages, not JSON APIs

### 7. Rate Limiting & Politeness
Botasaurus does NOT add delays between requests by default.
When scraping multiple URLs, the user should add their own rate limiting.
Aggressive scraping may get the user's IP blocked.

### 8. Bot Detection
While Botasaurus is designed to bypass bot detection, results vary by target:
- ✅ Works on most Cloudflare-protected sites
- ✅ Works on sites with basic bot detection
- ⚠️ May fail on advanced anti-bot systems (DataDome, Akamai)
- ⚠️ Headless Chrome (`@browser`) works better but is not exposed in this CLI

### 9. Error Handling
If a scrape fails, common causes:
- **Timeout**: Site is slow or blocking. Retry with longer timeout.
- **403/503**: Blocked by WAF. Try a different approach (browser-based tool).
- **SSL errors**: Site has certificate issues. Use `--json` to see raw response.
- **Empty title**: Page is not HTML (JSON, image, etc.) or JS-rendered.

### 10. API Responses
For scraping JSON APIs (REST, GraphQL), `scrape` returns the raw response length but can't parse it.
The user should use `curl` or dedicated API tools for structured API responses.

## Prompt Templates

- "Check if [URL] is accessible and returns 200"
- "Scrape the title and metadata from [URL]"
- "Can you access this Cloudflare-protected page: [URL]?"
- "Tell me if this URL is behind Cloudflare"
- "Extract the page content from [URL] and return JSON"

## Typical Workflow

```
→ "Check if example.com is accessible"
← botasaurus-cli web check "https://example.com"

→ "Scrape the title from that page"
← botasaurus-cli web scrape "https://example.com"

→ "Now try this Cloudflare site: https://nopecha.com/demo/cloudflare"
← botasaurus-cli web scrape "https://nopecha.com/demo/cloudflare"
   (may fail — JS challenges require @browser mode)
```

## Caveats Summary

| Concern | Details |
|---------|---------|
| First run | Downloads ~14MB deps, takes 10-30s |
| ctypes | Required. Some Python builds lack it |
| JS rendering | Not supported. HTTP-only |
| Captcha | Can't solve captchas (use @browser for that) |
| Rate limits | No built-in throttling |
| Cloudflare | Bypasses Connection Challenge, not JS Captcha |
