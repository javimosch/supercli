---
name: mkfs.cramfs
description: Use this skill when the user wants to use mkfs.cramfs, cli tool: mkfs.cramfs.
---

# mkfs.cramfs Plugin

CLI tool: mkfs.cramfs.

## Commands
- `mkfs.cramfs <resource> <action>` — Execute mkfs.cramfs commands
- `mkfs.cramfs self version` — Print mkfs.cramfs version
- `mkfs.cramfs _ _` — Passthrough to mkfs.cramfs CLI

## Usage Examples
- "mkfs.cramfs --help"
- "mkfs.cramfs self version"

## Installation
```bash
apt-get install mkfs.cramfs 2>/dev/null || which mkfs.cramfs
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
