---
name: vgremove
description: Use this skill when the user wants to use vgremove, Linux Logical Volume Manager.
---

# vgremove Plugin

vgremove — Linux Logical Volume Manager.

## Commands
- `vgremove <resource> <action>` — Execute vgremove commands
- `vgremove self version` — Print vgremove version
- `vgremove _ _` — Passthrough to vgremove CLI

## Usage Examples
- "vgremove --help"
- "vgremove self version"

## Installation
```bash
apt-get install lvm2 2>/dev/null || which vgremove
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
