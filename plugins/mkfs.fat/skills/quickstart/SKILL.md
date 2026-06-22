---
name: mkfs.fat
description: Use this skill when the user wants to use mkfs.fat, cli tool: mkfs.fat.
---

# mkfs.fat Plugin

CLI tool: mkfs.fat.

## Commands
- `mkfs.fat <resource> <action>` — Execute mkfs.fat commands
- `mkfs.fat self version` — Print mkfs.fat version
- `mkfs.fat _ _` — Passthrough to mkfs.fat CLI

## Usage Examples
- "mkfs.fat --help"
- "mkfs.fat self version"

## Installation
```bash
apt-get install mkfs.fat 2>/dev/null || which mkfs.fat
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
