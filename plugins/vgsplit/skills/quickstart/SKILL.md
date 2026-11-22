---
name: vgsplit
description: Use this skill when the user wants to use vgsplit, Linux Logical Volume Manager.
---

# vgsplit Plugin

vgsplit — Linux Logical Volume Manager.

## Commands
- `vgsplit <resource> <action>` — Execute vgsplit commands
- `vgsplit self version` — Print vgsplit version
- `vgsplit _ _` — Passthrough to vgsplit CLI

## Usage Examples
- "vgsplit --help"
- "vgsplit self version"

## Installation
```bash
apt-get install lvm2 2>/dev/null || which vgsplit
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
