---
name: vgconvert
description: Use this skill when the user wants to use vgconvert, Linux Logical Volume Manager.
---

# vgconvert Plugin

vgconvert — Linux Logical Volume Manager.

## Commands
- `vgconvert <resource> <action>` — Execute vgconvert commands
- `vgconvert self version` — Print vgconvert version
- `vgconvert _ _` — Passthrough to vgconvert CLI

## Usage Examples
- "vgconvert --help"
- "vgconvert self version"

## Installation
```bash
apt-get install lvm2 2>/dev/null || which vgconvert
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
