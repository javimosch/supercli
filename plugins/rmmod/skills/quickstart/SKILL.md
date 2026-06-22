---
name: rmmod
description: Use this skill when the user wants to use rmmod, cli tool: rmmod.
---

# rmmod Plugin

CLI tool: rmmod.

## Commands
- `rmmod <resource> <action>` — Execute rmmod commands
- `rmmod self version` — Print rmmod version
- `rmmod _ _` — Passthrough to rmmod CLI

## Usage Examples
- "rmmod --help"
- "rmmod self version"

## Installation
```bash
apt-get install rmmod 2>/dev/null || which rmmod
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
