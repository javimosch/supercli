---
name: nmcli
description: Use this skill when the user wants to use nmcli, cli tool: nmcli.
---

# nmcli Plugin

CLI tool: nmcli.

## Commands
- `nmcli <resource> <action>` — Execute nmcli commands
- `nmcli self version` — Print nmcli version
- `nmcli _ _` — Passthrough to nmcli CLI

## Usage Examples
- "nmcli --help"
- "nmcli self version"

## Installation
```bash
apt-get install nmcli 2>/dev/null || which nmcli
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
