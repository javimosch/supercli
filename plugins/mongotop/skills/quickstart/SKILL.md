---
name: mongotop
description: Use this skill when the user wants to use mongotop, cli tool: mongotop.
---

# mongotop Plugin

CLI tool: mongotop.

## Commands
- `mongotop <resource> <action>` — Execute mongotop commands
- `mongotop self version` — Print mongotop version
- `mongotop _ _` — Passthrough to mongotop CLI

## Usage Examples
- "mongotop --help"
- "mongotop self version"

## Installation
```bash
apt-get install mongotop 2>/dev/null || which mongotop
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
