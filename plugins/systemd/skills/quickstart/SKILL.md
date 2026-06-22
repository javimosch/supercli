---
name: systemd
description: Use this skill when the user wants to use systemd, cli tool: systemd.
---

# systemd Plugin

CLI tool: systemd.

## Commands
- `systemd <resource> <action>` — Execute systemd commands
- `systemd self version` — Print systemd version
- `systemd _ _` — Passthrough to systemd CLI

## Usage Examples
- "systemd --help"
- "systemd self version"

## Installation
```bash
apt-get install systemd 2>/dev/null || which systemd
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
