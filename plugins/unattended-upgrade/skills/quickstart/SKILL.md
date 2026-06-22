---
name: unattended-upgrade
description: Use this skill when the user wants to use unattended-upgrade, cli tool: unattended-upgrade.
---

# unattended-upgrade Plugin

CLI tool: unattended-upgrade.

## Commands
- `unattended-upgrade <resource> <action>` — Execute unattended-upgrade commands
- `unattended-upgrade self version` — Print unattended-upgrade version
- `unattended-upgrade _ _` — Passthrough to unattended-upgrade CLI

## Usage Examples
- "unattended-upgrade --help"
- "unattended-upgrade self version"

## Installation
```bash
apt-get install unattended-upgrade 2>/dev/null || which unattended-upgrade
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
