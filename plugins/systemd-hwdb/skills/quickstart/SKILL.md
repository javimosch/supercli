---
name: systemd-hwdb
description: Use this skill when the user wants to use systemd-hwdb, cli tool: systemd-hwdb.
---

# systemd-hwdb Plugin

CLI tool: systemd-hwdb.

## Commands
- `systemd-hwdb <resource> <action>` — Execute systemd-hwdb commands
- `systemd-hwdb self version` — Print systemd-hwdb version
- `systemd-hwdb _ _` — Passthrough to systemd-hwdb CLI

## Usage Examples
- "systemd-hwdb --help"
- "systemd-hwdb self version"

## Installation
```bash
apt-get install systemd-hwdb 2>/dev/null || which systemd-hwdb
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
