---
name: lvmconfig
description: Use this skill when the user wants to use lvmconfig, cli tool: lvmconfig.
---

# lvmconfig Plugin

CLI tool: lvmconfig.

## Commands
- `lvmconfig <resource> <action>` — Execute lvmconfig commands
- `lvmconfig self version` — Print lvmconfig version
- `lvmconfig _ _` — Passthrough to lvmconfig CLI

## Usage Examples
- "lvmconfig --help"
- "lvmconfig self version"

## Installation
```bash
apt-get install lvmconfig 2>/dev/null || which lvmconfig
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
