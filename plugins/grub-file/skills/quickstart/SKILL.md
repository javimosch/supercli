---
name: grub-file
description: Use this skill when the user wants to use grub-file, cli tool: grub-file.
---

# grub-file Plugin

CLI tool: grub-file.

## Commands
- `grub-file <resource> <action>` — Execute grub-file commands
- `grub-file self version` — Print grub-file version
- `grub-file _ _` — Passthrough to grub-file CLI

## Usage Examples
- "grub-file --help"
- "grub-file self version"

## Installation
```bash
apt-get install grub-file 2>/dev/null || which grub-file
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
