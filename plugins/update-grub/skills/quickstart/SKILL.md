---
name: update-grub
description: Use this skill when the user wants to use update-grub, cli tool: update-grub.
---

# update-grub Plugin

CLI tool: update-grub.

## Commands
- `update-grub <resource> <action>` — Execute update-grub commands
- `update-grub self version` — Print update-grub version
- `update-grub _ _` — Passthrough to update-grub CLI

## Usage Examples
- "update-grub --help"
- "update-grub self version"

## Installation
```bash
apt-get install update-grub 2>/dev/null || which update-grub
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
