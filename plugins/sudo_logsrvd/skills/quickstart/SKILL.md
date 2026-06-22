---
name: sudo_logsrvd
description: Use this skill when the user wants to use sudo_logsrvd, cli tool: sudo_logsrvd.
---

# sudo_logsrvd Plugin

CLI tool: sudo_logsrvd.

## Commands
- `sudo_logsrvd <resource> <action>` — Execute sudo_logsrvd commands
- `sudo_logsrvd self version` — Print sudo_logsrvd version
- `sudo_logsrvd _ _` — Passthrough to sudo_logsrvd CLI

## Usage Examples
- "sudo_logsrvd --help"
- "sudo_logsrvd self version"

## Installation
```bash
apt-get install sudo_logsrvd 2>/dev/null || which sudo_logsrvd
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
