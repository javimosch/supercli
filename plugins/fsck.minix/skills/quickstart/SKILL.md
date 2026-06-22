---
name: fsck.minix
description: Use this skill when the user wants to use fsck.minix, cli tool: fsck.minix.
---

# fsck.minix Plugin

CLI tool: fsck.minix.

## Commands
- `fsck.minix <resource> <action>` — Execute fsck.minix commands
- `fsck.minix self version` — Print fsck.minix version
- `fsck.minix _ _` — Passthrough to fsck.minix CLI

## Usage Examples
- "fsck.minix --help"
- "fsck.minix self version"

## Installation
```bash
apt-get install fsck.minix 2>/dev/null || which fsck.minix
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
