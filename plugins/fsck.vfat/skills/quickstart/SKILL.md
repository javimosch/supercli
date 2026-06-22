---
name: fsck.vfat
description: Use this skill when the user wants to use fsck.vfat, cli tool: fsck.vfat.
---

# fsck.vfat Plugin

CLI tool: fsck.vfat.

## Commands
- `fsck.vfat <resource> <action>` — Execute fsck.vfat commands
- `fsck.vfat self version` — Print fsck.vfat version
- `fsck.vfat _ _` — Passthrough to fsck.vfat CLI

## Usage Examples
- "fsck.vfat --help"
- "fsck.vfat self version"

## Installation
```bash
apt-get install fsck.vfat 2>/dev/null || which fsck.vfat
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
