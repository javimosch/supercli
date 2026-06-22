---
name: systemd-path
description: Use this skill when the user wants to use systemd-path, cli tool: systemd-path.
---

# systemd-path Plugin

CLI tool: systemd-path.

## Commands
- `systemd-path <resource> <action>` — Execute systemd-path commands
- `systemd-path self version` — Print systemd-path version
- `systemd-path _ _` — Passthrough to systemd-path CLI

## Usage Examples
- "systemd-path --help"
- "systemd-path self version"

## Installation
```bash
apt-get install systemd-path 2>/dev/null || which systemd-path
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
