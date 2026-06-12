---
name: jello
description: Use this skill when the user wants to filter or query JSON data using Python syntax instead of jq.
---
# jello Plugin
A CLI tool to filter JSON and JSON Lines data using Python syntax.
## Commands
- `jello self version` — Print jello version
- `jello _ _` — Passthrough to jello CLI
## Installation
```bash
pipx install jello
```
## Examples
```bash
cat data.json | jello '_.name'
cat data.json | jello '_.users[0].email'
```
## Key Features
- **Python syntax** — Use Python expressions for JSON filtering
- **JSON Lines support** — Process NDJSON data
- **Pipeline-ready** — Standard Unix pipe support
- **Color output** — Syntax-highlighted output
