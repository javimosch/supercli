---
name: ddgr
description: Use this skill when the user wants to search the web, find websites, look up documentation, search for code examples, or research topics online via DuckDuckGo. Supports JSON output for agent consumption.
---

# Ddgr Plugin

DuckDuckGo from the terminal. Web search with JSON output, no API key needed.

## Commands

### Self
- `ddgr self version` — Print ddgr version (v2.2+)

### Web
- `ddgr web search` — Interactive search (non-JSON, prompts for next actions)
- `ddgr web json` — Structured JSON search (returns array of results)

### Passthrough
- `ddgr _ _` — Full passthrough for any ddgr flags
- `sc ddgr --json --np <query>` — Recommended for agent/script usage

## Usage Examples
- "Search for Rust CLI frameworks"
- "Find documentation about async/await in Python"
- "Look up the latest news about LLMs"
- "Search for TypeScript testing libraries"
- "Search GitHub for a specific repository"

## Installation

```bash
pip install ddgr
```

## Examples

```bash
# Best for agents: JSON output, no prompt
sc ddgr --json --np "rust cli frameworks"

# Or use the named command
sc ddgr web json "async await python"

# Version check
sc ddgr self version

# Limit results (0-25)
sc ddgr --json --np -n 5 "rust async framework"

# Time range (d=day, w=week, m=month, y=year)
sc ddgr --json --np -t w "latest LLM news"

# Site-specific search
sc ddgr --json --np -w docs.rs "rust async"

# Disable user agent (may help with rate limiting)
sc ddgr --json --np --noua "search query"

# Region-specific (e.g., us-en, gb-en, fr-fr)
sc ddgr --json --np --reg us-en "python jobs"
```

## Output Format

JSON mode returns structured results:
```json
{
  "version": "1.0",
  "command": "ddgr.passthrough",
  "duration_ms": 1068,
  "data": [
    {
      "title": "Result Title",
      "url": "https://example.com",
      "abstract": "Result description..."
    }
  ]
}
```

## Key Features
- DuckDuckGo search, no API key needed
- JSON output with `--json` flag
- Result count control with `-n` (0-25)
- Time range filter (`-t d/w/m/y`)
- Site-specific search (`-w site.com`)
- Region-specific search (`--reg region-code`)
- Safe search with `--unsafe`
- Privacy-respecting (no tracking)
- Works in scripts/automation

## Caveats & Pitfalls

### Rate Limiting (HTTP 202)
DuckDuckGo aggressively rate-limits automated queries. When rate-limited, ddgr returns:
```
[ERROR] HTTP Error 202: Accepted
[]
```
This is a DDG-side protection, not a plugin bug. The plugin works correctly when not rate-limited.

**Mitigations:**
- Add delays between searches (3-5 seconds minimum)
- Use `--noua` to disable user agent (may help)
- Consider using a proxy with `-p URI` for bulk queries
- Accept that some queries will fail — retry with delay

### Interactive Mode Requires `--np`
Without `--np`, ddgr enters interactive mode and waits for user input (next/prev/open). Always use `--np` in scripts/agents to exit immediately after results.

### Empty Results
Rate-limited queries return empty arrays `[]`. Always check `data.length` before processing results. Empty results may indicate rate limiting, not zero actual matches.

### Binary Location
The plugin expects `ddgr` binary in PATH. If not found, ensure it's installed via `pip install ddgr`.

### Supercli Wrapper vs Direct ddgr
The supercli plugin wraps the `ddgr` binary via passthrough. All ddgr flags work identically through `sc ddgr`. Use the supercli wrapper for consistent JSON output formatting.
