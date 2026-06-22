---
name: grub-mount
description: Use this skill when the user wants to use grub-mount, cli tool: grub-mount.
---

# grub-mount Plugin

CLI tool: grub-mount.

## Commands
- `grub-mount <resource> <action>` — Execute grub-mount commands
- `grub-mount self version` — Print grub-mount version
- `grub-mount _ _` — Passthrough to grub-mount CLI

## Usage Examples
- "grub-mount --help"
- "grub-mount self version"

## Installation
```bash
apt-get install grub-mount 2>/dev/null || which grub-mount
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
