---
name: vgmknodes
description: Use this skill when the user wants to use vgmknodes, Linux Logical Volume Manager.
---

# vgmknodes Plugin

vgmknodes — Linux Logical Volume Manager.

## Commands
- `vgmknodes <resource> <action>` — Execute vgmknodes commands
- `vgmknodes self version` — Print vgmknodes version
- `vgmknodes _ _` — Passthrough to vgmknodes CLI

## Usage Examples
- "vgmknodes --help"
- "vgmknodes self version"

## Installation
```bash
apt-get install lvm2 2>/dev/null || which vgmknodes
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
