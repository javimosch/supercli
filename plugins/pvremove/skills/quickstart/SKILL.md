---
name: pvremove
description: Use this skill when the user wants to use pvremove, cli tool: pvremove.
---

# pvremove Plugin

CLI tool: pvremove.

## Commands
- `pvremove <resource> <action>` — Execute pvremove commands
- `pvremove self version` — Print pvremove version
- `pvremove _ _` — Passthrough to pvremove CLI

## Usage Examples
- "pvremove --help"
- "pvremove self version"

## Installation
```bash
apt-get install pvremove 2>/dev/null || which pvremove
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
