---
name: systemd-cgtop
description: Use this skill when the user wants to use systemd-cgtop, cli tool: systemd-cgtop.
---

# systemd-cgtop Plugin

CLI tool: systemd-cgtop.

## Commands
- `systemd-cgtop <resource> <action>` — Execute systemd-cgtop commands
- `systemd-cgtop self version` — Print systemd-cgtop version
- `systemd-cgtop _ _` — Passthrough to systemd-cgtop CLI

## Usage Examples
- "systemd-cgtop --help"
- "systemd-cgtop self version"

## Installation
```bash
apt-get install systemd-cgtop 2>/dev/null || which systemd-cgtop
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
