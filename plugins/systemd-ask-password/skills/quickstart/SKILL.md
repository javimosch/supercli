---
name: systemd-ask-password
description: Use this skill when the user wants to use systemd-ask-password, cli tool: systemd-ask-password.
---

# systemd-ask-password Plugin

CLI tool: systemd-ask-password.

## Commands
- `systemd-ask-password <resource> <action>` — Execute systemd-ask-password commands
- `systemd-ask-password self version` — Print systemd-ask-password version
- `systemd-ask-password _ _` — Passthrough to systemd-ask-password CLI

## Usage Examples
- "systemd-ask-password --help"
- "systemd-ask-password self version"

## Installation
```bash
apt-get install systemd-ask-password 2>/dev/null || which systemd-ask-password
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
