---
name: unattended-upgrades
description: Use this skill when the user wants to use unattended-upgrades, cli tool: unattended-upgrades.
---

# unattended-upgrades Plugin

CLI tool: unattended-upgrades.

## Commands
- `unattended-upgrades <resource> <action>` — Execute unattended-upgrades commands
- `unattended-upgrades self version` — Print unattended-upgrades version
- `unattended-upgrades _ _` — Passthrough to unattended-upgrades CLI

## Usage Examples
- "unattended-upgrades --help"
- "unattended-upgrades self version"

## Installation
```bash
apt-get install unattended-upgrades 2>/dev/null || which unattended-upgrades
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
