---
name: systemd-cat
description: Use this skill when the user wants to use systemd-cat, cli tool: systemd-cat.
---

# systemd-cat Plugin

CLI tool: systemd-cat.

## Commands
- `systemd-cat <resource> <action>` — Execute systemd-cat commands
- `systemd-cat self version` — Print systemd-cat version
- `systemd-cat _ _` — Passthrough to systemd-cat CLI

## Usage Examples
- "systemd-cat --help"
- "systemd-cat self version"

## Installation
```bash
apt-get install systemd-cat 2>/dev/null || which systemd-cat
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
