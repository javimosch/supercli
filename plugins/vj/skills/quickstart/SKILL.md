---
name: vj
description: Use this skill when the user wants to pretty-print and format JSON data with syntax highlighting.
---
# vj Plugin
A lightweight JSON pretty-printer with syntax highlighting.
## Commands
- `vj self version` — Print vj version
- `vj _ _` — Passthrough to vj CLI
## Installation
```bash
npm install -g vj
```
## Examples
```bash
cat data.json | vj
curl -s api.example.com | vj
```
## Key Features
- **Pretty-print** — Human-readable JSON formatting
- **Syntax highlighting** — Color-coded JSON output
- **Pipeline-ready** — stdin/stdout support
