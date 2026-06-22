---
name: systemd-cgls
description: Use this skill when the user wants to use systemd-cgls, cli tool: systemd-cgls.
---

# systemd-cgls Plugin

CLI tool: systemd-cgls.

## Commands
- `systemd-cgls <resource> <action>` — Execute systemd-cgls commands
- `systemd-cgls self version` — Print systemd-cgls version
- `systemd-cgls _ _` — Passthrough to systemd-cgls CLI

## Usage Examples
- "systemd-cgls --help"
- "systemd-cgls self version"

## Installation
```bash
apt-get install systemd-cgls 2>/dev/null || which systemd-cgls
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
