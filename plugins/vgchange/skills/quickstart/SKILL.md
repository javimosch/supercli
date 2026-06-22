---
name: vgchange
description: Use this skill when the user wants to use vgchange, cli tool: vgchange.
---

# vgchange Plugin

CLI tool: vgchange.

## Commands
- `vgchange <resource> <action>` — Execute vgchange commands
- `vgchange self version` — Print vgchange version
- `vgchange _ _` — Passthrough to vgchange CLI

## Usage Examples
- "vgchange --help"
- "vgchange self version"

## Installation
```bash
apt-get install vgchange 2>/dev/null || which vgchange
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
