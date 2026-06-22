---
name: vgextend
description: Use this skill when the user wants to use vgextend, cli tool: vgextend.
---

# vgextend Plugin

CLI tool: vgextend.

## Commands
- `vgextend <resource> <action>` — Execute vgextend commands
- `vgextend self version` — Print vgextend version
- `vgextend _ _` — Passthrough to vgextend CLI

## Usage Examples
- "vgextend --help"
- "vgextend self version"

## Installation
```bash
apt-get install vgextend 2>/dev/null || which vgextend
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
