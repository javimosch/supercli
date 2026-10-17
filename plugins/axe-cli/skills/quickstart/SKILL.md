---
name: axe-cli
description: Use this skill when the user wants to test web pages for accessibility issues — WCAG violations, ARIA problems, contrast errors, and more.
---

# axe-cli Plugin

axe-cli runs accessibility tests from the command line.

## Commands
- `axe-cli <resource> <action>` — Execute axe-cli commands
- `axe-cli self version` — Print axe-cli version
- `axe-cli _ _` — Passthrough to axe-cli CLI

## Usage Examples

- "check a webpage for WCAG violations"
- "test all pages in sitemap for a11y issues"
- "output accessibility results as JSON"
- "verify ARIA landmark structure"

## Installation

```bash
npm install -g axe-cli
```

## Key Features
- WCAG 2.x violation detection
- ARIA attribute validation
- Color contrast checking
- Keyboard accessibility testing
- HTML file and URL scanning
- JSON output for CI integration
- Sitemap crawling for multi-page audits
