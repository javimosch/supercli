---
name: fallocate
description: Use this skill when the user wants to use fallocate, cli tool: fallocate.
---

# fallocate Plugin

CLI tool: fallocate.

## Commands
- `fallocate <resource> <action>` — Execute fallocate commands
- `fallocate self version` — Print fallocate version
- `fallocate _ _` — Passthrough to fallocate CLI

## Usage Examples
- "fallocate --help"
- "fallocate self version"

## Installation
```bash
apt-get install fallocate 2>/dev/null || which fallocate
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
