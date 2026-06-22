---
name: systemd-inhibit
description: Use this skill when the user wants to use systemd-inhibit, cli tool: systemd-inhibit.
---

# systemd-inhibit Plugin

CLI tool: systemd-inhibit.

## Commands
- `systemd-inhibit <resource> <action>` — Execute systemd-inhibit commands
- `systemd-inhibit self version` — Print systemd-inhibit version
- `systemd-inhibit _ _` — Passthrough to systemd-inhibit CLI

## Usage Examples
- "systemd-inhibit --help"
- "systemd-inhibit self version"

## Installation
```bash
apt-get install systemd-inhibit 2>/dev/null || which systemd-inhibit
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
