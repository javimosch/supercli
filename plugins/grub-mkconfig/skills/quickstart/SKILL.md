---
name: grub-mkconfig
description: Use this skill when the user wants to use grub-mkconfig, cli tool: grub-mkconfig.
---

# grub-mkconfig Plugin

CLI tool: grub-mkconfig.

## Commands
- `grub-mkconfig <resource> <action>` — Execute grub-mkconfig commands
- `grub-mkconfig self version` — Print grub-mkconfig version
- `grub-mkconfig _ _` — Passthrough to grub-mkconfig CLI

## Usage Examples
- "grub-mkconfig --help"
- "grub-mkconfig self version"

## Installation
```bash
apt-get install grub-mkconfig 2>/dev/null || which grub-mkconfig
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
