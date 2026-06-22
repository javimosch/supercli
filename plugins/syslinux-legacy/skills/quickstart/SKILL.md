---
name: syslinux-legacy
description: Use this skill when the user wants to use syslinux-legacy, cli tool: syslinux-legacy.
---

# syslinux-legacy Plugin

CLI tool: syslinux-legacy.

## Commands
- `syslinux-legacy <resource> <action>` — Execute syslinux-legacy commands
- `syslinux-legacy self version` — Print syslinux-legacy version
- `syslinux-legacy _ _` — Passthrough to syslinux-legacy CLI

## Usage Examples
- "syslinux-legacy --help"
- "syslinux-legacy self version"

## Installation
```bash
apt-get install syslinux-legacy 2>/dev/null || which syslinux-legacy
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
