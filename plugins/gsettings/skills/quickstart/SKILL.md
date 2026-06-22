---
name: gsettings
description: Use this skill when the user wants to use gsettings, cli tool: gsettings.
---

# gsettings Plugin

CLI tool: gsettings.

## Commands
- `gsettings <resource> <action>` — Execute gsettings commands
- `gsettings self version` — Print gsettings version
- `gsettings _ _` — Passthrough to gsettings CLI

## Usage Examples
- "gsettings --help"
- "gsettings self version"

## Installation
```bash
apt-get install gsettings 2>/dev/null || which gsettings
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
