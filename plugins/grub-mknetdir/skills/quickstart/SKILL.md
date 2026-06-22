---
name: grub-mknetdir
description: Use this skill when the user wants to use grub-mknetdir, cli tool: grub-mknetdir.
---

# grub-mknetdir Plugin

CLI tool: grub-mknetdir.

## Commands
- `grub-mknetdir <resource> <action>` — Execute grub-mknetdir commands
- `grub-mknetdir self version` — Print grub-mknetdir version
- `grub-mknetdir _ _` — Passthrough to grub-mknetdir CLI

## Usage Examples
- "grub-mknetdir --help"
- "grub-mknetdir self version"

## Installation
```bash
apt-get install grub-mknetdir 2>/dev/null || which grub-mknetdir
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
