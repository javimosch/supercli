---
name: ldconfig
description: Use this skill when the user wants to use ldconfig, cli tool: ldconfig.
---

# ldconfig Plugin

CLI tool: ldconfig.

## Commands
- `ldconfig <resource> <action>` — Execute ldconfig commands
- `ldconfig self version` — Print ldconfig version
- `ldconfig _ _` — Passthrough to ldconfig CLI

## Usage Examples
- "ldconfig --help"
- "ldconfig self version"

## Installation
```bash
apt-get install ldconfig 2>/dev/null || which ldconfig
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
