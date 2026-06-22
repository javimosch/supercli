---
name: grub-reboot
description: Use this skill when the user wants to use grub-reboot, cli tool: grub-reboot.
---

# grub-reboot Plugin

CLI tool: grub-reboot.

## Commands
- `grub-reboot <resource> <action>` — Execute grub-reboot commands
- `grub-reboot self version` — Print grub-reboot version
- `grub-reboot _ _` — Passthrough to grub-reboot CLI

## Usage Examples
- "grub-reboot --help"
- "grub-reboot self version"

## Installation
```bash
apt-get install grub-reboot 2>/dev/null || which grub-reboot
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
