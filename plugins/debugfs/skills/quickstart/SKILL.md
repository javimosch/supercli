---
name: debugfs
description: Use this skill when the user wants to use debugfs, cli tool: debugfs.
---

# debugfs Plugin

CLI tool: debugfs.

## Commands
- `debugfs <resource> <action>` — Execute debugfs commands
- `debugfs self version` — Print debugfs version
- `debugfs _ _` — Passthrough to debugfs CLI

## Usage Examples
- "debugfs --help"
- "debugfs self version"

## Installation
```bash
apt-get install debugfs 2>/dev/null || which debugfs
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
