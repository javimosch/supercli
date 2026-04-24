---
name: webclaw
description: Use this skill when the user wants to scrape web pages, crawl websites, or extract structured content from URLs for LLM consumption.
---

# webclaw Plugin

Fast, local-first web content extraction for LLMs. webclaw scrapes single pages, crawls entire sites, and outputs clean structured data in markdown, JSON, text, or LLM-optimized formats. Zero browser overhead.

## Commands

### Extraction
- `webclaw page extract` — Extract content from a single web page
- `webclaw site crawl` — Crawl a website and extract from multiple pages
- `webclaw page diff` — Compare a page against a previous snapshot
- `webclaw self version` — Print webclaw version
- `webclaw _ _` — Passthrough to webclaw CLI

## Usage Examples
- "Extract the content from https://example.com as markdown"
- "Crawl https://docs.example.com to depth 2"
- "Scrape a page and output JSON"
- "Extract brand information from a website"

## Installation

```bash
brew tap 0xMassi/webclaw && brew install webclaw
```

## Examples

```bash
# Extract a single page as markdown
webclaw page extract https://stripe.com -f markdown

# Extract main content only
webclaw page extract https://example.com --only-main-content

# Extract with specific CSS selectors
webclaw page extract https://example.com --include "article, .content" --exclude "nav, footer"

# Extract brand assets
webclaw page extract https://github.com --brand

# Crawl a docs site to depth 2, max 50 pages
webclaw site crawl https://docs.rust-lang.org --depth 2 --max-pages 50 -f markdown

# Crawl from sitemap
webclaw site crawl https://example.com --sitemap -f json

# Discover URLs only
webclaw site crawl https://example.com --map

# Extract as LLM-optimized format
webclaw page extract https://example.com -f llm

# Compare page against a snapshot
webclaw page extract https://example.com -f json > snap.json
webclaw page diff snap.json https://example.com
```

## Key Features
- Sub-millisecond extraction with zero browser overhead
- 5 output formats: markdown, text, JSON, LLM-optimized, HTML
- CSS selector filtering (--include, --exclude)
- Auto-detect main content with --only-main-content
- Same-origin BFS crawling with depth and max-pages limits
- Sitemap-based crawling
- Brand extraction (colors, fonts, logos)
- Change tracking with snapshot diffing
- PDF and YouTube metadata extraction
- Readability scoring and noise filtering
