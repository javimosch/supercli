---
name: vboxautostart
description: Use this skill when the user wants to use vboxautostart, cli tool: vboxautostart.
---

# vboxautostart Plugin

CLI tool: vboxautostart.

## Commands
- `vboxautostart <resource> <action>` — Execute vboxautostart commands
- `vboxautostart self version` — Print vboxautostart version
- `vboxautostart _ _` — Passthrough to vboxautostart CLI

## Usage Examples
- "vboxautostart --help"
- "vboxautostart self version"

## Installation
```bash
apt-get install vboxautostart 2>/dev/null || which vboxautostart
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
