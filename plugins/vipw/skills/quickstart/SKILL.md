---
name: vipw
description: Use this skill when the user wants to use vipw, change and administer password and group data.
---

# vipw Plugin

vipw — change and administer password and group data.

## Commands
- `vipw <resource> <action>` — Execute vipw commands
- `vipw self version` — Print vipw version
- `vipw _ _` — Passthrough to vipw CLI

## Usage Examples
- "vipw --help"
- "vipw self version"

## Installation
```bash
apt-get install passwd 2>/dev/null || which vipw
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
