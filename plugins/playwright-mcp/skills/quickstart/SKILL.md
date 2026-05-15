---
name: playwright-mcp
description: Use this skill when the user needs browser automation — navigate, click, type, take screenshots, extract page data via MCP.
---

# Playwright MCP — Browser Automation for AI Agents

Official Microsoft MCP server (32.5k⭐). Control browser via MCP tools over stdio. Works with any MCP client.

## Quick Start

```bash
sc playwright-mcp self mcp      # Register MCP server
# Then agents can use browser tools directly
```

## MCP Tools Available

Once registered, agents get these tools:

| Tool | Description |
|------|-------------|
| `browser_navigate` | Navigate to a URL |
| `browser_click` | Click element by selector |
| `browser_fill` | Fill input field |
| `browser_snapshot` | Get page state (accessible snapshot) |
| `browser_screenshot` | Take screenshot |
| `browser_press_key` | Press keyboard key |
| `browser_close` | Close current page |

## Usage (via Agent)

Agents can say:
- "Navigate to https://example.com"
- "Take a screenshot of the page"
- "Click the login button"
- "Fill the search box with 'query'"

## Requirements

- Node.js 18+ (for npx)
- First run auto-downloads @playwright/mcp from npm

## Notes

- Each agent session spawns a new browser context
- Screenshots return base64-encoded PNG
- Uses Chromium by default (auto-installed)
- For persistent sessions, keep the daemon running
