---
name: update-rc.d
description: Use this skill when the user wants to use update-rc.d, cli tool: update-rc.d.
---

# update-rc.d Plugin

CLI tool: update-rc.d.

## Commands
- `update-rc.d <resource> <action>` — Execute update-rc.d commands
- `update-rc.d self version` — Print update-rc.d version
- `update-rc.d _ _` — Passthrough to update-rc.d CLI

## Usage Examples
- "update-rc.d --help"
- "update-rc.d self version"

## Installation
```bash
apt-get install update-rc.d 2>/dev/null || which update-rc.d
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
