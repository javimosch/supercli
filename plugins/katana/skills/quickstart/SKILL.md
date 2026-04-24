---
name: katana
description: Use this skill when the user wants to crawl websites, discover endpoints, find URLs, or perform web reconnaissance.
---

# katana Plugin

A next-generation crawling and spidering framework. Discover URLs, endpoints, and assets from web applications with headless and standard crawling modes.

## Commands

### Crawling
- `katana crawl url` — Crawl URL for endpoints and assets

### Utility
- `katana _ _` — Passthrough to katana CLI

## Usage Examples
- "Crawl this website for endpoints"
- "Discover all URLs on this domain"
- "Find assets and endpoints"
- "Crawl with JavaScript rendering"

## Installation

```bash
brew install katana
```

Or via Go:
```bash
go install github.com/projectdiscovery/katana/cmd/katana@latest
```

## Examples

```bash
# Basic crawl
katana crawl url -u https://example.com

# Crawl with depth limit
katana crawl url -u https://example.com -d 3

# Enable JavaScript crawling
katana crawl url -u https://example.com -js-crawl

# Headless browser mode
katana crawl url -u https://example.com -headless

# Output to file
katana crawl url -u https://example.com -o results.txt

# JSON output
katana crawl url -u https://example.com -json

# Set crawl scope
katana crawl url -u https://example.com -field-scope rdn

# Set concurrency
katana crawl url -u https://example.com -concurrency 10

# Rate limit requests
katana crawl url -u https://example.com -rate-limit 5

# Any katana command with passthrough
katana _ _ -u https://example.com -d 2 -json
katana _ _ -u https://example.com -js-crawl -headless
```

## Key Features
- **Standard crawling** - Fast HTTP-based crawling
- **Headless mode** - JavaScript rendering with browser
- **JavaScript crawling** - Execute and crawl JS-generated content
- **Scope control** - Field-based scope configuration
- **Rate limiting** - Respectful crawling with rate limits
- **Concurrency control** - Adjustable parallelism
- **Depth control** - Limit crawl depth
- **Multiple outputs** - Text, JSON, JSONL formats
- **Asset discovery** - Find JavaScript, CSS, images, etc.
- **Endpoint discovery** - Find API endpoints and parameters

## Notes
- Default depth is unlimited
- Headless mode requires browser dependencies
- JavaScript crawling can find dynamically loaded content
- Can be used for reconnaissance and security testing
- Supports custom headers and authentication
