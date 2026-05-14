---
name: botasaurus-cli
description: Use this skill when the user needs to scrape a web page, check if a URL is accessible, or extract content from behind Cloudflare protection.
---

# botasaurus-cli — Web Scraping CLI

Scrape web pages from the command line with Cloudflare bypass and anti-detect HTTP requests. Wraps Botasaurus (4.7k ⭐).

## Installation

```bash
pip install botasaurus
pip install botasaurus-cli
```

## Commands

- `botasaurus-cli web scrape <url> [--json]` — Scrape a URL
- `botasaurus-cli web check <url> [--json]` — Check if URL is accessible
- `botasaurus-cli self version` — Show engine info

## Usage Examples

- "Check if example.com is accessible"
- "Scrape the title and content from https://example.com"
- "Is this URL behind Cloudflare? Check it."
- "Extract data from this page and return JSON"

## Key Features

- Cloudflare WAF bypass
- Anti-detect browser-like requests
- JSON output for automation
- No browser needed (HTTP-based)
