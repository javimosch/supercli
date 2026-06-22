---
name: grub-install
description: Use this skill when the user wants to use grub-install, cli tool: grub-install.
---

# grub-install Plugin

CLI tool: grub-install.

## Commands
- `grub-install <resource> <action>` — Execute grub-install commands
- `grub-install self version` — Print grub-install version
- `grub-install _ _` — Passthrough to grub-install CLI

## Usage Examples
- "grub-install --help"
- "grub-install self version"

## Installation
```bash
apt-get install grub-install 2>/dev/null || which grub-install
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
