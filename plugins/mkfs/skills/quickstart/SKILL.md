---
name: mkfs
description: Use this skill when the user wants to use mkfs, cli tool: mkfs.
---

# mkfs Plugin

CLI tool: mkfs.

## Commands
- `mkfs <resource> <action>` — Execute mkfs commands
- `mkfs self version` — Print mkfs version
- `mkfs _ _` — Passthrough to mkfs CLI

## Usage Examples
- "mkfs --help"
- "mkfs self version"

## Installation
```bash
apt-get install mkfs 2>/dev/null || which mkfs
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
