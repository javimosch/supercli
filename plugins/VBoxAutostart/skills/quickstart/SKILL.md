---
name: VBoxAutostart
description: Use this skill when the user wants to use VBoxAutostart, cli tool: vboxautostart.
---

# VBoxAutostart Plugin

CLI tool: VBoxAutostart.

## Commands
- `VBoxAutostart <resource> <action>` — Execute VBoxAutostart commands
- `VBoxAutostart self version` — Print VBoxAutostart version
- `VBoxAutostart _ _` — Passthrough to VBoxAutostart CLI

## Usage Examples
- "VBoxAutostart --help"
- "VBoxAutostart self version"

## Installation
```bash
apt-get install VBoxAutostart 2>/dev/null || which VBoxAutostart
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
