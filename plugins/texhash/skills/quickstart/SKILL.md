---
name: texhash
description: Use this skill when the user wants to use texhash, cli tool: texhash.
---

# texhash Plugin

CLI tool: texhash.

## Commands
- `texhash <resource> <action>` — Execute texhash commands
- `texhash self version` — Print texhash version
- `texhash _ _` — Passthrough to texhash CLI

## Usage Examples
- "texhash --help"
- "texhash self version"

## Installation
```bash
apt-get install texhash 2>/dev/null || which texhash
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
