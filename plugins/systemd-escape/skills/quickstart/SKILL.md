---
name: systemd-escape
description: Use this skill when the user wants to use systemd-escape, cli tool: systemd-escape.
---

# systemd-escape Plugin

CLI tool: systemd-escape.

## Commands
- `systemd-escape <resource> <action>` — Execute systemd-escape commands
- `systemd-escape self version` — Print systemd-escape version
- `systemd-escape _ _` — Passthrough to systemd-escape CLI

## Usage Examples
- "systemd-escape --help"
- "systemd-escape self version"

## Installation
```bash
apt-get install systemd-escape 2>/dev/null || which systemd-escape
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
