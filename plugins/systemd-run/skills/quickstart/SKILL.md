---
name: systemd-run
description: Use this skill when the user wants to use systemd-run, cli tool: systemd-run.
---

# systemd-run Plugin

CLI tool: systemd-run.

## Commands
- `systemd-run <resource> <action>` — Execute systemd-run commands
- `systemd-run self version` — Print systemd-run version
- `systemd-run _ _` — Passthrough to systemd-run CLI

## Usage Examples
- "systemd-run --help"
- "systemd-run self version"

## Installation
```bash
apt-get install systemd-run 2>/dev/null || which systemd-run
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
