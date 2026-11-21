---
name: vgreduce
description: Use this skill when the user wants to use vgreduce, Linux Logical Volume Manager.
---

# vgreduce Plugin

vgreduce — Linux Logical Volume Manager.

## Commands
- `vgreduce <resource> <action>` — Execute vgreduce commands
- `vgreduce self version` — Print vgreduce version
- `vgreduce _ _` — Passthrough to vgreduce CLI

## Usage Examples
- "vgreduce --help"
- "vgreduce self version"

## Installation
```bash
apt-get install lvm2 2>/dev/null || which vgreduce
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
