---
name: vgcfgbackup
description: Use this skill when the user wants to use vgcfgbackup, Linux Logical Volume Manager.
---

# vgcfgbackup Plugin

vgcfgbackup — Linux Logical Volume Manager.

## Commands
- `vgcfgbackup <resource> <action>` — Execute vgcfgbackup commands
- `vgcfgbackup self version` — Print vgcfgbackup version
- `vgcfgbackup _ _` — Passthrough to vgcfgbackup CLI

## Usage Examples
- "vgcfgbackup --help"
- "vgcfgbackup self version"

## Installation
```bash
apt-get install lvm2 2>/dev/null || which vgcfgbackup
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
