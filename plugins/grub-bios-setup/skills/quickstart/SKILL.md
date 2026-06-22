---
name: grub-bios-setup
description: Use this skill when the user wants to use grub-bios-setup, cli tool: grub-bios-setup.
---

# grub-bios-setup Plugin

CLI tool: grub-bios-setup.

## Commands
- `grub-bios-setup <resource> <action>` — Execute grub-bios-setup commands
- `grub-bios-setup self version` — Print grub-bios-setup version
- `grub-bios-setup _ _` — Passthrough to grub-bios-setup CLI

## Usage Examples
- "grub-bios-setup --help"
- "grub-bios-setup self version"

## Installation
```bash
apt-get install grub-bios-setup 2>/dev/null || which grub-bios-setup
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
