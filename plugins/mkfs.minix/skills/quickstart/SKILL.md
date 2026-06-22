---
name: mkfs.minix
description: Use this skill when the user wants to use mkfs.minix, cli tool: mkfs.minix.
---

# mkfs.minix Plugin

CLI tool: mkfs.minix.

## Commands
- `mkfs.minix <resource> <action>` — Execute mkfs.minix commands
- `mkfs.minix self version` — Print mkfs.minix version
- `mkfs.minix _ _` — Passthrough to mkfs.minix CLI

## Usage Examples
- "mkfs.minix --help"
- "mkfs.minix self version"

## Installation
```bash
apt-get install mkfs.minix 2>/dev/null || which mkfs.minix
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
