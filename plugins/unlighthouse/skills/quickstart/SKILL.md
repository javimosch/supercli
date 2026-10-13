---
name: unlighthouse
description: Use this skill when the user wants to run Google Lighthouse audits across an entire website — all routes, performance/accessibility/SEO scores, CI budgets.
---

# unlighthouse Plugin

unlighthouse crawls every route of a site and runs Google Lighthouse on each page — performance, accessibility, best-practices, SEO — with aggregate reporting. The `unlighthouse-ci` binary is the headless CI runner.

## Commands

- `unlighthouse site audit` — Headless audit: `unlighthouse-ci --site <url> --reporter json`
- `unlighthouse site dashboard` — Interactive scan with live dashboard (`unlighthouse` binary)
- `unlighthouse _ _` — Passthrough to unlighthouse-ci

## Usage Examples

- "Audit the whole staging site for performance and accessibility"
- "Generate a JSON lighthouse report for all pages of example.com"
- "Fail CI if any page scores below 80"

## Installation

```bash
npm install -g @unlighthouse/cli
# or one-off: npx unlighthouse-ci --site https://example.com
```

## Examples

```bash
unlighthouse-ci --site https://example.com --reporter json
unlighthouse-ci --site https://example.com --reporter csvExpanded --output-path ./reports
unlighthouse-ci --site https://staging.example.com --budget 80
unlighthouse-ci --site https://example.com --build-static
unlighthouse-ci --site https://example.com --samples 3
```

## Key Features

- Reporters: `json`, `jsonExpanded`, `csv`, `csvExpanded`, `lighthouseServer`, `false`
- `--budget <1-100>` fails the run when scores drop below the threshold
- `--build-static` exports a shareable HTML report
- Reports land in `.unlighthouse/` (override with `--output-path`)
- Needs Chrome (auto-downloaded on first run); Node 24.13.1+ for v1
