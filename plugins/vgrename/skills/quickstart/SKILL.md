---
name: vgrename
description: Use this skill when the user wants to use vgrename, Linux Logical Volume Manager.
---

# vgrename Plugin

vgrename — Linux Logical Volume Manager.

## Commands
- `vgrename <resource> <action>` — Execute vgrename commands
- `vgrename self version` — Print vgrename version
- `vgrename _ _` — Passthrough to vgrename CLI

## Usage Examples
- "vgrename --help"
- "vgrename self version"

## Installation
```bash
apt-get install lvm2 2>/dev/null || which vgrename
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
