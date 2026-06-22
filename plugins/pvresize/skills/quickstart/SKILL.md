---
name: pvresize
description: Use this skill when the user wants to use pvresize, cli tool: pvresize.
---

# pvresize Plugin

CLI tool: pvresize.

## Commands
- `pvresize <resource> <action>` — Execute pvresize commands
- `pvresize self version` — Print pvresize version
- `pvresize _ _` — Passthrough to pvresize CLI

## Usage Examples
- "pvresize --help"
- "pvresize self version"

## Installation
```bash
apt-get install pvresize 2>/dev/null || which pvresize
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
