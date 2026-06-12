---
name: jtbl
description: Use this skill when the user wants to display JSON data as a formatted terminal table.
---
# jtbl Plugin
Transform JSON into formatted terminal tables.
## Commands
- `jtbl _ _` — Passthrough to jtbl CLI
## Installation
```bash
pipx install jtbl
```
## Examples
```bash
cat data.json | jtbl
```
## Key Features
- **JSON to table** — Convert JSON arrays to readable tables
- **Pipeline-ready** — stdin/stdout support
- **Clean output** — Well-formatted terminal tables
