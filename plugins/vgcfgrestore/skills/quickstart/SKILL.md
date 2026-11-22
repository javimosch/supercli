---
name: vgcfgrestore
description: Use this skill when the user wants to use vgcfgrestore, Linux Logical Volume Manager.
---

# vgcfgrestore Plugin

vgcfgrestore — Linux Logical Volume Manager.

## Commands
- `vgcfgrestore <resource> <action>` — Execute vgcfgrestore commands
- `vgcfgrestore self version` — Print vgcfgrestore version
- `vgcfgrestore _ _` — Passthrough to vgcfgrestore CLI

## Usage Examples
- "vgcfgrestore --help"
- "vgcfgrestore self version"

## Installation
```bash
apt-get install lvm2 2>/dev/null || which vgcfgrestore
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
