---
name: psselect
description: Use this skill when the user wants to use psselect, cli tool: psselect.
---

# psselect Plugin

CLI tool: psselect.

## Commands
- `psselect <resource> <action>` — Execute psselect commands
- `psselect self version` — Print psselect version
- `psselect _ _` — Passthrough to psselect CLI

## Usage Examples
- "psselect --help"
- "psselect self version"

## Installation
```bash
apt-get install psselect 2>/dev/null || which psselect
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
