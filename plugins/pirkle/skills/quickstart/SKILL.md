---
name: pirkle
description: Use this skill when the user wants to query CSV, SQLite, or JSON files using PRQL queries with pipeline support.
---
# pirkle Plugin
A fast CLI to query CSV, SQLite, and JSON files using PRQL.
## Commands
- `pirkle self version` — Print pirkle version
- `pirkle _ _` — Passthrough to pirkle CLI
## Installation
```bash
cargo install pirkle
```
## Examples
```bash
pirkle --format json query 'from users | filter age > 18 | select {name, email}'
```
## Key Features
- **PRQL queries** — Expressive pipelined query language
- **Multi-format** — CSV, SQLite, JSON support
- **Pipeline-ready** — stdin/stdout support
- **Multiple output formats** — table, csv, jsonl, logfmt
