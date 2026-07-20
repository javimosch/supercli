---
name: pa11y
description: Use this skill when the user wants automated accessibility (a11y) testing — WCAG compliance checks on URLs or HTML with CI-friendly JSON reports.
---

# pa11y Plugin

pa11y runs automated accessibility audits against web pages. Detects WCAG violations with actionable output — ideal for CI pipelines and pre-release checks.

## Installation

```bash
npm install -g pa11y
```

## Basic Usage

```bash
# Test a live URL
pa11y https://example.com

# Test local HTML file
pa11y ./index.html

# JSON output for CI
pa11y --reporter json https://example.com
```

## Common Patterns

```bash
# WCAG 2.1 AA standard
pa11y --standard WCAG2AA https://example.com

# Ignore known issues via config
pa11y --config .pa11yci.json https://example.com

# Screenshot on failure
pa11y --screen-capture error.png https://example.com

# Run against multiple URLs (pa11y-ci)
pa11y-ci --sitemap https://example.com/sitemap.xml
```

## Usage Examples

- "Check https://mysite.com for WCAG 2.1 AA violations"
- "Run pa11y with JSON output in CI"
- "Audit local index.html for accessibility issues"

## SuperCLI

```bash
sc pa11y self version
sc pa11y _ _ --standard WCAG2AA https://example.com
sc plugins learn pa11y
```
