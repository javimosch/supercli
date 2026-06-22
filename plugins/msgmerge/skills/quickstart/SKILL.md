---
name: msgmerge
description: Use this skill when the user wants to use msgmerge, cli tool: msgmerge.
---

# msgmerge Plugin

CLI tool: msgmerge.

## Commands
- `msgmerge <resource> <action>` — Execute msgmerge commands
- `msgmerge self version` — Print msgmerge version
- `msgmerge _ _` — Passthrough to msgmerge CLI

## Usage Examples
- "msgmerge --help"
- "msgmerge self version"

## Installation
```bash
apt-get install msgmerge 2>/dev/null || which msgmerge
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
