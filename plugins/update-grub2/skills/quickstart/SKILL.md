---
name: update-grub2
description: Use this skill when the user wants to use update-grub2, cli tool: update-grub2.
---

# update-grub2 Plugin

CLI tool: update-grub2.

## Commands
- `update-grub2 <resource> <action>` — Execute update-grub2 commands
- `update-grub2 self version` — Print update-grub2 version
- `update-grub2 _ _` — Passthrough to update-grub2 CLI

## Usage Examples
- "update-grub2 --help"
- "update-grub2 self version"

## Installation
```bash
apt-get install update-grub2 2>/dev/null || which update-grub2
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
