---
name: systemd-notify
description: Use this skill when the user wants to use systemd-notify, cli tool: systemd-notify.
---

# systemd-notify Plugin

CLI tool: systemd-notify.

## Commands
- `systemd-notify <resource> <action>` — Execute systemd-notify commands
- `systemd-notify self version` — Print systemd-notify version
- `systemd-notify _ _` — Passthrough to systemd-notify CLI

## Usage Examples
- "systemd-notify --help"
- "systemd-notify self version"

## Installation
```bash
apt-get install systemd-notify 2>/dev/null || which systemd-notify
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
