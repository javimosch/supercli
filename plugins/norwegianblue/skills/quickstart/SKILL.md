---
name: norwegianblue
description: Use this skill when the user wants to check end-of-life dates for software products or dependencies.
---
# norwegianblue Plugin
A CLI tool to fetch end-of-life (EOL) dates from endoflife.date.
## Commands
- `norwegianblue self version` — Print norwegianblue version
- `norwegianblue _ _` — Passthrough to norwegianblue CLI
## Installation
```bash
pipx install norwegianblue
```
## Examples
```bash
norwegianblue python
norwegianblue --format json nodejs
norwegianblue --format csv ubuntu
```
## Key Features
- **EOL tracking** — Check end-of-life dates
- **Multi-format** — JSON, CSV, TSV output
- **CI-ready** — Pipeline integration for dependency checks
- **No auth** — Uses public endoflife.date API
- **Wide coverage** — 300+ products tracked
