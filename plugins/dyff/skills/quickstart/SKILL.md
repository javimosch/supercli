---
name: dyff
description: Use this skill when the user wants to diff YAML or JSON files and see color-coded structural differences.
---
# dyff Plugin
A diff tool for YAML and JSON files with color-coded structural difference output.
## Commands
- `dyff self version` — Print dyff version
- `dyff _ _` — Passthrough to dyff CLI
## Installation
```bash
brew install dyff
```
## Examples
```bash
dyff between file1.yaml file2.yaml
dyff between --json file1.json file2.json
```
## Key Features
- **YAML/JSON diff** — Structural diff for config files
- **Color output** — Color-coded differences
- **Pipeline-ready** — Machine-readable JSON output
- **Multiple formats** — YAML and JSON support
