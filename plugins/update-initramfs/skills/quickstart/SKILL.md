---
name: update-initramfs
description: Use this skill when the user wants to use update-initramfs, cli tool: update-initramfs.
---

# update-initramfs Plugin

CLI tool: update-initramfs.

## Commands
- `update-initramfs <resource> <action>` — Execute update-initramfs commands
- `update-initramfs self version` — Print update-initramfs version
- `update-initramfs _ _` — Passthrough to update-initramfs CLI

## Usage Examples
- "update-initramfs --help"
- "update-initramfs self version"

## Installation
```bash
apt-get install update-initramfs 2>/dev/null || which update-initramfs
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
