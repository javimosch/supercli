---
name: unix_update
description: Use this skill when the user wants to use unix_update, cli tool: unix_update.
---

# unix_update Plugin

CLI tool: unix_update.

## Commands
- `unix_update <resource> <action>` — Execute unix_update commands
- `unix_update self version` — Print unix_update version
- `unix_update _ _` — Passthrough to unix_update CLI

## Usage Examples
- "unix_update --help"
- "unix_update self version"

## Installation
```bash
apt-get install unix_update 2>/dev/null || which unix_update
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
