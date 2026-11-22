---
name: vgchange
description: Use this skill when the user wants to use vgchange, Linux Logical Volume Manager.
---

# vgchange Plugin

vgchange — Linux Logical Volume Manager.

## Commands
- `vgchange <resource> <action>` — Execute vgchange commands
- `vgchange self version` — Print vgchange version
- `vgchange _ _` — Passthrough to vgchange CLI

## Usage Examples
- "vgchange --help"
- "vgchange self version"

## Installation
```bash
apt-get install lvm2 2>/dev/null || which vgchange
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
