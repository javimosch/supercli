---
name: systemd-mount
description: Use this skill when the user wants to use systemd-mount, cli tool: systemd-mount.
---

# systemd-mount Plugin

CLI tool: systemd-mount.

## Commands
- `systemd-mount <resource> <action>` — Execute systemd-mount commands
- `systemd-mount self version` — Print systemd-mount version
- `systemd-mount _ _` — Passthrough to systemd-mount CLI

## Usage Examples
- "systemd-mount --help"
- "systemd-mount self version"

## Installation
```bash
apt-get install systemd-mount 2>/dev/null || which systemd-mount
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
