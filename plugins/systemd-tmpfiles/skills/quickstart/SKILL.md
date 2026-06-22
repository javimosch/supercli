---
name: systemd-tmpfiles
description: Use this skill when the user wants to use systemd-tmpfiles, cli tool: systemd-tmpfiles.
---

# systemd-tmpfiles Plugin

CLI tool: systemd-tmpfiles.

## Commands
- `systemd-tmpfiles <resource> <action>` — Execute systemd-tmpfiles commands
- `systemd-tmpfiles self version` — Print systemd-tmpfiles version
- `systemd-tmpfiles _ _` — Passthrough to systemd-tmpfiles CLI

## Usage Examples
- "systemd-tmpfiles --help"
- "systemd-tmpfiles self version"

## Installation
```bash
apt-get install systemd-tmpfiles 2>/dev/null || which systemd-tmpfiles
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
