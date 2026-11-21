---
name: vgscan
description: Use this skill when the user wants to use vgscan, Linux Logical Volume Manager.
---

# vgscan Plugin

vgscan — Linux Logical Volume Manager.

## Commands
- `vgscan <resource> <action>` — Execute vgscan commands
- `vgscan self version` — Print vgscan version
- `vgscan _ _` — Passthrough to vgscan CLI

## Usage Examples
- "vgscan --help"
- "vgscan self version"

## Installation
```bash
apt-get install lvm2 2>/dev/null || which vgscan
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
