---
name: grub-mkrescue
description: Use this skill when the user wants to use grub-mkrescue, cli tool: grub-mkrescue.
---

# grub-mkrescue Plugin

CLI tool: grub-mkrescue.

## Commands
- `grub-mkrescue <resource> <action>` — Execute grub-mkrescue commands
- `grub-mkrescue self version` — Print grub-mkrescue version
- `grub-mkrescue _ _` — Passthrough to grub-mkrescue CLI

## Usage Examples
- "grub-mkrescue --help"
- "grub-mkrescue self version"

## Installation
```bash
apt-get install grub-mkrescue 2>/dev/null || which grub-mkrescue
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
