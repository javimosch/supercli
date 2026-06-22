---
name: mongostat
description: Use this skill when the user wants to use mongostat, cli tool: mongostat.
---

# mongostat Plugin

CLI tool: mongostat.

## Commands
- `mongostat <resource> <action>` — Execute mongostat commands
- `mongostat self version` — Print mongostat version
- `mongostat _ _` — Passthrough to mongostat CLI

## Usage Examples
- "mongostat --help"
- "mongostat self version"

## Installation
```bash
apt-get install mongostat 2>/dev/null || which mongostat
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
