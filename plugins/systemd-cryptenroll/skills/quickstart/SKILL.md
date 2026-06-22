---
name: systemd-cryptenroll
description: Use this skill when the user wants to use systemd-cryptenroll, cli tool: systemd-cryptenroll.
---

# systemd-cryptenroll Plugin

CLI tool: systemd-cryptenroll.

## Commands
- `systemd-cryptenroll <resource> <action>` — Execute systemd-cryptenroll commands
- `systemd-cryptenroll self version` — Print systemd-cryptenroll version
- `systemd-cryptenroll _ _` — Passthrough to systemd-cryptenroll CLI

## Usage Examples
- "systemd-cryptenroll --help"
- "systemd-cryptenroll self version"

## Installation
```bash
apt-get install systemd-cryptenroll 2>/dev/null || which systemd-cryptenroll
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
