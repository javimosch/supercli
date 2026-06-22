---
name: lvmdump
description: Use this skill when the user wants to use lvmdump, cli tool: lvmdump.
---

# lvmdump Plugin

CLI tool: lvmdump.

## Commands
- `lvmdump <resource> <action>` — Execute lvmdump commands
- `lvmdump self version` — Print lvmdump version
- `lvmdump _ _` — Passthrough to lvmdump CLI

## Usage Examples
- "lvmdump --help"
- "lvmdump self version"

## Installation
```bash
apt-get install lvmdump 2>/dev/null || which lvmdump
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
