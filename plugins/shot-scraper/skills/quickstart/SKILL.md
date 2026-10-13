---
name: shot-scraper
description: Use this skill when the user wants to screenshot a web page, capture it as PDF, dump rendered HTML, or run JavaScript against a live page - all headless.
---

# shot-scraper Plugin

shot-scraper automates headless Chromium (Playwright): full-page/element screenshots, PDF capture, rendered HTML dumps, JavaScript evaluation, accessibility snapshots, and multi-shot YAML scripts.

## Commands

### Capture
- `shot-scraper page shot` — Screenshot: sc shot-scraper page shot https://example.com -o shot.png
- `shot-scraper page pdf` — Save as PDF: sc shot-scraper page pdf https://example.com -o page.pdf
- `shot-scraper page html` — Rendered HTML: sc shot-scraper page html https://example.com
- `shot-scraper page javascript` — Run JS: sc shot-scraper page javascript https://x 'document.title'

### General
- `shot-scraper self version` — Print shot-scraper version
- `shot-scraper _ _` — Passthrough to shot-scraper CLI

## Usage Examples
- "Take a full-page screenshot of this URL"
- "Save this article as a PDF"
- "Get the rendered HTML after JavaScript runs"

## Installation

```bash
pipx install shot-scraper && shot-scraper install
```

## Examples

```bash
shot-scraper https://example.com -o shot.png
shot-scraper https://example.com --selector '#main' -o el.png
shot-scraper pdf https://example.com -o page.pdf
shot-scraper multi shots.yml
```

## Key Features
- Full-page or CSS-selector shots
- PDF + HTML + accessibility capture
- JS evaluation on live pages
- YAML multi-shot scripts (shot-scraper multi)
