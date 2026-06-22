---
name: mkfs.vfat
description: Use this skill when the user wants to use mkfs.vfat, cli tool: mkfs.vfat.
---

# mkfs.vfat Plugin

CLI tool: mkfs.vfat.

## Commands
- `mkfs.vfat <resource> <action>` — Execute mkfs.vfat commands
- `mkfs.vfat self version` — Print mkfs.vfat version
- `mkfs.vfat _ _` — Passthrough to mkfs.vfat CLI

## Usage Examples
- "mkfs.vfat --help"
- "mkfs.vfat self version"

## Installation
```bash
apt-get install mkfs.vfat 2>/dev/null || which mkfs.vfat
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
