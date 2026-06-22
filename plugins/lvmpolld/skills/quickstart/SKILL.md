---
name: lvmpolld
description: Use this skill when the user wants to use lvmpolld, cli tool: lvmpolld.
---

# lvmpolld Plugin

CLI tool: lvmpolld.

## Commands
- `lvmpolld <resource> <action>` — Execute lvmpolld commands
- `lvmpolld self version` — Print lvmpolld version
- `lvmpolld _ _` — Passthrough to lvmpolld CLI

## Usage Examples
- "lvmpolld --help"
- "lvmpolld self version"

## Installation
```bash
apt-get install lvmpolld 2>/dev/null || which lvmpolld
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
