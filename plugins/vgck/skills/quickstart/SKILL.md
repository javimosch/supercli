---
name: vgck
description: Use this skill when the user wants to use vgck, Linux Logical Volume Manager.
---

# vgck Plugin

vgck — Linux Logical Volume Manager.

## Commands
- `vgck <resource> <action>` — Execute vgck commands
- `vgck self version` — Print vgck version
- `vgck _ _` — Passthrough to vgck CLI

## Usage Examples
- "vgck --help"
- "vgck self version"

## Installation
```bash
apt-get install lvm2 2>/dev/null || which vgck
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
