---
name: ppa-purge
description: Use this skill when the user wants to use ppa-purge, cli tool: ppa-purge.
---

# ppa-purge Plugin

CLI tool: ppa-purge.

## Commands
- `ppa-purge <resource> <action>` — Execute ppa-purge commands
- `ppa-purge self version` — Print ppa-purge version
- `ppa-purge _ _` — Passthrough to ppa-purge CLI

## Usage Examples
- "ppa-purge --help"
- "ppa-purge self version"

## Installation
```bash
apt-get install ppa-purge 2>/dev/null || which ppa-purge
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
