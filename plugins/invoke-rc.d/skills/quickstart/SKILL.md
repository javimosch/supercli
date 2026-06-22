---
name: invoke-rc.d
description: Use this skill when the user wants to use invoke-rc.d, cli tool: invoke-rc.d.
---

# invoke-rc.d Plugin

CLI tool: invoke-rc.d.

## Commands
- `invoke-rc.d <resource> <action>` — Execute invoke-rc.d commands
- `invoke-rc.d self version` — Print invoke-rc.d version
- `invoke-rc.d _ _` — Passthrough to invoke-rc.d CLI

## Usage Examples
- "invoke-rc.d --help"
- "invoke-rc.d self version"

## Installation
```bash
apt-get install invoke-rc.d 2>/dev/null || which invoke-rc.d
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
