---
name: systemd-sysusers
description: Use this skill when the user wants to use systemd-sysusers, cli tool: systemd-sysusers.
---

# systemd-sysusers Plugin

CLI tool: systemd-sysusers.

## Commands
- `systemd-sysusers <resource> <action>` — Execute systemd-sysusers commands
- `systemd-sysusers self version` — Print systemd-sysusers version
- `systemd-sysusers _ _` — Passthrough to systemd-sysusers CLI

## Usage Examples
- "systemd-sysusers --help"
- "systemd-sysusers self version"

## Installation
```bash
apt-get install systemd-sysusers 2>/dev/null || which systemd-sysusers
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
