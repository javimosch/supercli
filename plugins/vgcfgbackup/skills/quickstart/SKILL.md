---
name: vgcfgbackup
description: Use this skill when the user wants to use vgcfgbackup, cli tool: vgcfgbackup.
---

# vgcfgbackup Plugin

CLI tool: vgcfgbackup.

## Commands
- `vgcfgbackup <resource> <action>` — Execute vgcfgbackup commands
- `vgcfgbackup self version` — Print vgcfgbackup version
- `vgcfgbackup _ _` — Passthrough to vgcfgbackup CLI

## Usage Examples
- "vgcfgbackup --help"
- "vgcfgbackup self version"

## Installation
```bash
apt-get install vgcfgbackup 2>/dev/null || which vgcfgbackup
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
