---
name: grub-mkimage
description: Use this skill when the user wants to use grub-mkimage, cli tool: grub-mkimage.
---

# grub-mkimage Plugin

CLI tool: grub-mkimage.

## Commands
- `grub-mkimage <resource> <action>` — Execute grub-mkimage commands
- `grub-mkimage self version` — Print grub-mkimage version
- `grub-mkimage _ _` — Passthrough to grub-mkimage CLI

## Usage Examples
- "grub-mkimage --help"
- "grub-mkimage self version"

## Installation
```bash
apt-get install grub-mkimage 2>/dev/null || which grub-mkimage
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
