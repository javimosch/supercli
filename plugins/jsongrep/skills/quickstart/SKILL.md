---
name: jsongrep
description: Use this skill to grep-like search through structured data files.
---
# jsongrep Plugin
Grep for structured data (JSON, YAML, TOML).
## Commands
- `jsongrep _ _` — Passthrough to jsongrep CLI
## Installation
```bash
go install github.com/nhooyr/jsongrep@latest
```
## Key Features
- **Multi-format** — JSON, YAML, TOML support
- **Path queries** — Grep-like pattern matching
- **Pipeline-ready** — stdin/stdout support
