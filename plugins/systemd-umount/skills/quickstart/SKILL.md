---
name: systemd-umount
description: Use this skill when the user wants to use systemd-umount, cli tool: systemd-umount.
---

# systemd-umount Plugin

CLI tool: systemd-umount.

## Commands
- `systemd-umount <resource> <action>` — Execute systemd-umount commands
- `systemd-umount self version` — Print systemd-umount version
- `systemd-umount _ _` — Passthrough to systemd-umount CLI

## Usage Examples
- "systemd-umount --help"
- "systemd-umount self version"

## Installation
```bash
apt-get install systemd-umount 2>/dev/null || which systemd-umount
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
