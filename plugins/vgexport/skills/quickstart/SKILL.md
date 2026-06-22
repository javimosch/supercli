---
name: vgexport
description: Use this skill when the user wants to use vgexport, cli tool: vgexport.
---

# vgexport Plugin

CLI tool: vgexport.

## Commands
- `vgexport <resource> <action>` — Execute vgexport commands
- `vgexport self version` — Print vgexport version
- `vgexport _ _` — Passthrough to vgexport CLI

## Usage Examples
- "vgexport --help"
- "vgexport self version"

## Installation
```bash
apt-get install vgexport 2>/dev/null || which vgexport
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
