---
name: vgimportclone
description: Use this skill when the user wants to use vgimportclone, Linux Logical Volume Manager.
---

# vgimportclone Plugin

vgimportclone — Linux Logical Volume Manager.

## Commands
- `vgimportclone <resource> <action>` — Execute vgimportclone commands
- `vgimportclone self version` — Print vgimportclone version
- `vgimportclone _ _` — Passthrough to vgimportclone CLI

## Usage Examples
- "vgimportclone --help"
- "vgimportclone self version"

## Installation
```bash
apt-get install lvm2 2>/dev/null || which vgimportclone
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
