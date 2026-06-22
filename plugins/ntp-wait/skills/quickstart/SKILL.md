---
name: ntp-wait
description: Use this skill when the user wants to use ntp-wait, cli tool: ntp-wait.
---

# ntp-wait Plugin

CLI tool: ntp-wait.

## Commands
- `ntp-wait <resource> <action>` — Execute ntp-wait commands
- `ntp-wait self version` — Print ntp-wait version
- `ntp-wait _ _` — Passthrough to ntp-wait CLI

## Usage Examples
- "ntp-wait --help"
- "ntp-wait self version"

## Installation
```bash
apt-get install ntp-wait 2>/dev/null || which ntp-wait
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
