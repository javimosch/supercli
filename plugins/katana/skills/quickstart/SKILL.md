---
name: katana
description: Use this skill when the user needs web crawling — discover endpoints, extract URLs, map attack surface, or gather intelligence on web applications.
---

# Katana — Web Crawling & Spidering

Next-gen crawling framework by [projectdiscovery](https://github.com/projectdiscovery/katana) (16.7k⭐). Fast, headless, JS-aware.

## Quick Start

```bash
sc katana crawl url <target-url>                      # Basic crawl
sc katana crawl url <url> -jsonl                       # JSONL output (per-line JSON)
sc katana crawl url <url> -headless -depth 3           # Headless mode, depth 3
sc katana crawl url <url> -jc                          # Crawl JS files too
```

## Commands

### Crawl
- `sc katana crawl url <url>` — crawl a URL, discover endpoints
- `sc katana crawl url <url> -depth 5` — set crawl depth
- `sc katana crawl url <url> -headless` — headless browser (slower, JS-rendered)
- `sc katana crawl url <url> -jc` — crawl JavaScript files too
- `sc katana crawl url <url> -json` — JSON output
- `sc katana crawl url <url> -f qurl` — filter by response type (qurl, url, endpoint)
- `sc katana crawl url <url> -o output.txt` — save to file

### Passthrough
- `sc katana _ -u <url> -list urls.txt` — crawl from file list
- `sc katana _ -u <url> -scope "example.com"` — scope control

## Requirements

- Go binary from GitHub releases
- Linux/macOS/Windows

## Examples

```bash
# Basic crawl
sc katana crawl url https://example.com

# Deep headless crawl with JS
sc katana crawl url https://example.com -headless -depth 5 -jc

# JSON output filtered by query
sc katana crawl url https://example.com -json -f qurl

# Crawl from file list
sc katana _ -list urls.txt -depth 2 -o results.txt
```

## Tips

- Use `-depth` to control crawl depth (default: 2)
- `-headless` uses Chrome/Chromium — slower but gets JS-rendered content
- Combine `-jc` with `-f endpoint` to find API endpoints in JS files
- Output to file with `-o` for large crawls
- Pipe to other tools: `katana -u https://example.com | httpx`
