---
name: codepack
description: Use this skill when the user wants to package code files for LLM consumption with structure preservation.
---
# codepack Plugin
Extract folder structures and file contents into compact LLM-optimized outputs.
## Commands
- `codepack self version` — Print codepack version
- `codepack _ _` — Passthrough to codepack CLI
## Installation
```bash
npm install -g codepack
```
## Examples
```bash
codepack src/
codepack --format json src/
```
## Key Features
- **LLM-optimized** — Compact output for AI context windows
- **Structure preservation** — Maintains directory structure
- **Pipeline-ready** — Standard output for piping
- **Multiple formats** — Text and JSON output
