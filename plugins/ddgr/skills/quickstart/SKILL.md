---
name: ddgr
description: Use this skill when the user wants to search the web, find websites, look up documentation, search for code examples, or research topics online via DuckDuckGo. Supports JSON output for agent consumption.
---

# Ddgr Plugin

DuckDuckGo from the terminal. Web search with JSON output, no API key needed.

## Commands

### Self
- `ddgr self version` — Print version

### Web
- `ddgr web search` — Search DuckDuckGo (passthrough: `ddgr <keywords>`)
- `ddgr web json` — Search with JSON output (`ddgr --json <keywords>`)

### Passthrough
- `ddgr _ _` — Passthrough for any ddgr command

## Usage Examples
- "Search for Rust CLI frameworks"
- "Find documentation about async/await in Python"
- "Look up the latest news about LLMs"
- "Search for TypeScript testing libraries"

## Installation

```bash
pip install ddgr
```

## Examples

```bash
# Basic search
ddgr rust cli frameworks

# JSON output for agent consumption
ddgr --json async await python

# Limit results
ddgr -n 5 rust async framework

# Time range
ddgr -t week latest LLM news

# Site-specific
ddgr -w docs.rs rust async

# Disable autocorrect
ddgr --noua rust langauge

# Region-specific results
ddgr --gb python jobs
```

## Key Features
- DuckDuckGo search, no API key needed
- JSON output with `--json`
- Result count control with `-n`
- Time range filter (`-t day/week/month/year`)
- Site-specific search (`-w site.com`)
- Region-specific search (`--us`, `--gb`, etc.)
- Safe search with `--unsafe`
- Privacy-respecting (no tracking)
- Works in scripts/automation
