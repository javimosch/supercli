# dembrandt Plugin

## Overview

Extracts design tokens from any live website URL using [dembrandt](https://github.com/dembrandt/dembrandt). Analyzes computed DOM styles and CSS variables via Playwright to produce a structured design system — colors, typography, spacing, borders, shadows, component patterns, logos, favicons, and breakpoints.

Great for:
- **Design audits** — reverse-engineer any site's design system
- **Competitor analysis** — extract color palettes, font stacks, spacing scales
- **Design system documentation** — save token output as JSON for reference
- **Migration/rebuilds** — capture the existing design tokens before a redesign

## Installation

```bash
# Install the plugin via supercli
sc plugins install ./plugins/dembrandt --on-conflict replace --json

# Install dembrandt globally (optional, works via npx too)
npm install -g dembrandt
```

## Available Commands

| Command | Description |
|---|---|
| `sc dembrandt self analyze <url>` | Extract design tokens from a website |
| `sc dembrandt self analyze <url> --dtcg` | Export in W3C Design Tokens format |
| `sc dembrandt self analyze <url> --save-output` | Save results as JSON |
| `sc dembrandt self analyze <url> --dark-mode` | Extract dark mode tokens |
| `sc dembrandt self analyze <url> --browser=firefox` | Use Firefox (bypasses bot detection) |
| `sc dembrandt self analyze <url> --slow` | Slow mode for JS-heavy SPAs |
| `sc dembrandt _ <args>` | Passthrough for advanced usage |

## Flags Reference

| Flag | Type | Description |
|---|---|---|
| `--dtcg` | flag | Export tokens in W3C Design Tokens standard format |
| `--save-output` | flag | Save results as JSON file |
| `--browser` | option | Browser engine: `chromium` (default) or `firefox` |
| `--dark-mode` | flag | Extract dark mode color tokens |
| `--slow` | flag | Reliable extraction on JS-heavy SPAs |

## Usage Examples

```bash
# Basic extraction
sc dembrandt self analyze https://example.com

# Save as JSON for documentation
sc dembrandt self analyze https://example.com --save-output

# W3C standard format
sc dembrandt self analyze https://example.com --dtcg

# Bot-protected site with Firefox
sc dembrandt self analyze https://example.com --browser=firefox

# Dark mode tokens
sc dembrandt self analyze https://example.com --dark-mode

# JS-heavy SPA with slow mode
sc dembrandt self analyze https://example.com --slow
```

## Tips

- First run may take extra time to download Chromium browser engine (~150MB)
- Use `--browser=firefox` for sites with aggressive Cloudflare/bot detection
- Use `--slow` for SPAs like React/Vue/Angular apps with heavy JS
- Combine flags: `sc dembrandt self analyze <url> --dark-mode --save-output --dtcg`
- Output is structured JSON — pipe through `jq` for further processing
