---
name: playwright-cli
description: Use this skill when the user wants to automate browser interactions — open pages, click elements, type text, take screenshots, manage tabs, test web apps, or control a headless/headed browser via CLI.
---

# Playwright CLI Plugin

Token-efficient browser automation CLI by Microsoft. Designed for coding agents — snapshot pages, interact via element refs, and control multiple browser sessions.

## Commands

### Self
- `playwright-cli self version` — Print version
- `playwright-cli self install-skills` — Install Playwright skills for agents

### Browser
- `playwright-cli browser open` — Open browser, optionally navigate to URL (use `--headed` to see it)
- `playwright-cli browser goto` — Navigate to a URL
- `playwright-cli browser close` — Close the current page/session
- `playwright-cli browser reload` — Reload current page

### Element
- `playwright-cli element click` — Click element by ref, CSS selector, or Playwright locator
- `playwright-cli element dblclick` — Double click element
- `playwright-cli element type` — Type text into focused element
- `playwright-cli element fill` — Fill text into editable element (use `--submit` for Enter)
- `playwright-cli element check` — Check checkbox or radio button
- `playwright-cli element select` — Select dropdown option
- `playwright-cli element hover` — Hover over element
- `playwright-cli element snapshot` — Capture page snapshot to get element refs
- `playwright-cli element upload` — Upload files

### Keyboard
- `playwright-cli keyboard press` — Press a key (Enter, Escape, Tab, arrow keys, etc.)

### Screenshot
- `playwright-cli screenshot take` — Take screenshot of page or element

### Tabs
- `playwright-cli tab new` — Create new tab
- `playwright-cli tab close` — Close tab by index
- `playwright-cli tab select` — Select tab by index

### Sessions
- `playwright-cli session list` — List all active sessions
- `playwright-cli session close-all` — Close all browser sessions
- `playwright-cli session kill-all` — Force kill all browser processes

### Passthrough
- `playwright-cli _ _` — Direct passthrough for any playwright-cli command (cookies, storage, network, devtools, dialogs, etc.)

## Usage Examples
- "Open https://example.com and take a screenshot"
- "Snapshot the page and click the login button"
- "Fill the search form and press Enter"
- "Open demo app and test the signup flow"
- "Check all completed todos on the page"

## Installation

```bash
npm install -g @playwright/cli@latest
playwright-cli install --skills
```

## Examples

```bash
# Open and interact with a page
playwright-cli open https://demo.playwright.dev/todomvc/ --headed
playwright-cli snapshot
playwright-cli type "Buy groceries"
playwright-cli press Enter
playwright-cli check e21
playwright-cli screenshot --filename=todo.png

# Multiple sessions
playwright-cli -s=project1 open https://example.com
playwright-cli -s=project2 open https://playwright.dev
playwright-cli list

# Tab management
playwright-cli tab-new https://example.com
playwright-cli tab-select 1

# Cookie operations (via passthrough)
playwright-cli cookie-list
playwright-cli cookie-set session_id abc123

# Network (via passthrough)
playwright-cli requests
playwright-cli route "**/*.png" --abort

# DevTools (via passthrough)
playwright-cli console
playwright-cli generate-locator e15
```

## Key Features
- Token-efficient: Does not force page data into LLM context
- Element refs from snapshots for precise interaction
- Multi-session support for parallel browser instances
- Screenshots, PDFs, videos, and traces
- Network request inspection and mocking
- Full storage state management (cookies, localStorage, sessionStorage)
- Tab management
- Keyboard and mouse control
- Config file support for repeatable workflows
