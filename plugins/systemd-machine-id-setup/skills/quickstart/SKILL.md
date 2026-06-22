---
name: systemd-machine-id-setup
description: Use this skill when the user wants to use systemd-machine-id-setup, cli tool: systemd-machine-id-setup.
---

# systemd-machine-id-setup Plugin

CLI tool: systemd-machine-id-setup.

## Commands
- `systemd-machine-id-setup <resource> <action>` — Execute systemd-machine-id-setup commands
- `systemd-machine-id-setup self version` — Print systemd-machine-id-setup version
- `systemd-machine-id-setup _ _` — Passthrough to systemd-machine-id-setup CLI

## Usage Examples
- "systemd-machine-id-setup --help"
- "systemd-machine-id-setup self version"

## Installation
```bash
apt-get install systemd-machine-id-setup 2>/dev/null || which systemd-machine-id-setup
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
