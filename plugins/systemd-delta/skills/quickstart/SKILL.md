---
name: systemd-delta
description: Use this skill when the user wants to use systemd-delta, cli tool: systemd-delta.
---

# systemd-delta Plugin

CLI tool: systemd-delta.

## Commands
- `systemd-delta <resource> <action>` — Execute systemd-delta commands
- `systemd-delta self version` — Print systemd-delta version
- `systemd-delta _ _` — Passthrough to systemd-delta CLI

## Usage Examples
- "systemd-delta --help"
- "systemd-delta self version"

## Installation
```bash
apt-get install systemd-delta 2>/dev/null || which systemd-delta
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
