---
name: vboxconfig
description: Use this skill when the user wants to use vboxconfig, cli tool: vboxconfig.
---

# vboxconfig Plugin

CLI tool: vboxconfig.

## Commands
- `vboxconfig <resource> <action>` — Execute vboxconfig commands
- `vboxconfig self version` — Print vboxconfig version
- `vboxconfig _ _` — Passthrough to vboxconfig CLI

## Usage Examples
- "vboxconfig --help"
- "vboxconfig self version"

## Installation
```bash
apt-get install vboxconfig 2>/dev/null || which vboxconfig
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
