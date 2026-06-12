---
name: fselect
description: Use this skill to find files using SQL-like queries with JSON/CSV output.
---
# fselect Plugin
Find files with SQL-like queries.
## Commands
- `fselect self version` — Print fselect version
- `fselect _ _` — Passthrough to fselect CLI
## Installation
```bash
cargo install fselect
```
## Examples
```bash
fselect "name, size from . where name like '%.rs'" --json
fselect "path, mtime from . order by mtime desc limit 10" --csv
```
## Key Features
- **SQL syntax** — Query files with familiar SQL
- **Multiple formats** — JSON, CSV, formatted output
- **Pipeline-ready** — Standard Unix pipe support
- **Powerful filtering** — Complex file queries
