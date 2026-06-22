---
name: systemd-id128
description: Use this skill when the user wants to use systemd-id128, cli tool: systemd-id128.
---

# systemd-id128 Plugin

CLI tool: systemd-id128.

## Commands
- `systemd-id128 <resource> <action>` — Execute systemd-id128 commands
- `systemd-id128 self version` — Print systemd-id128 version
- `systemd-id128 _ _` — Passthrough to systemd-id128 CLI

## Usage Examples
- "systemd-id128 --help"
- "systemd-id128 self version"

## Installation
```bash
apt-get install systemd-id128 2>/dev/null || which systemd-id128
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
