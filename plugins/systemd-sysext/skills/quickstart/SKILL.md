---
name: systemd-sysext
description: Use this skill when the user wants to use systemd-sysext, cli tool: systemd-sysext.
---

# systemd-sysext Plugin

CLI tool: systemd-sysext.

## Commands
- `systemd-sysext <resource> <action>` — Execute systemd-sysext commands
- `systemd-sysext self version` — Print systemd-sysext version
- `systemd-sysext _ _` — Passthrough to systemd-sysext CLI

## Usage Examples
- "systemd-sysext --help"
- "systemd-sysext self version"

## Installation
```bash
apt-get install systemd-sysext 2>/dev/null || which systemd-sysext
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
