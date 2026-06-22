---
name: grub-fstest
description: Use this skill when the user wants to use grub-fstest, cli tool: grub-fstest.
---

# grub-fstest Plugin

CLI tool: grub-fstest.

## Commands
- `grub-fstest <resource> <action>` — Execute grub-fstest commands
- `grub-fstest self version` — Print grub-fstest version
- `grub-fstest _ _` — Passthrough to grub-fstest CLI

## Usage Examples
- "grub-fstest --help"
- "grub-fstest self version"

## Installation
```bash
apt-get install grub-fstest 2>/dev/null || which grub-fstest
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
