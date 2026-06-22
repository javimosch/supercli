---
name: systemd-resolve
description: Use this skill when the user wants to use systemd-resolve, cli tool: systemd-resolve.
---

# systemd-resolve Plugin

CLI tool: systemd-resolve.

## Commands
- `systemd-resolve <resource> <action>` — Execute systemd-resolve commands
- `systemd-resolve self version` — Print systemd-resolve version
- `systemd-resolve _ _` — Passthrough to systemd-resolve CLI

## Usage Examples
- "systemd-resolve --help"
- "systemd-resolve self version"

## Installation
```bash
apt-get install systemd-resolve 2>/dev/null || which systemd-resolve
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
