---
name: ghcrawl
description: Use this skill to crawl and analyze GitHub repositories with JSON output.
---
# ghcrawl Plugin
GitHub repository crawler with JSON output.
## Commands
- `ghcrawl _ _` — Passthrough to ghcrawl CLI
## Installation
```bash
go install github.com/pwrdrvr/ghcrawl@latest
```
## Examples
```bash
ghcrawl --json https://github.com/user/repo
```
## Key Features
- **Repo crawling** — Analyze GitHub repositories
- **JSON output** — Machine-readable results
- **Pipeline-ready** — Automation-friendly
