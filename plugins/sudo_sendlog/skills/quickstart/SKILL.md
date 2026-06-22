---
name: sudo_sendlog
description: Use this skill when the user wants to use sudo_sendlog, cli tool: sudo_sendlog.
---

# sudo_sendlog Plugin

CLI tool: sudo_sendlog.

## Commands
- `sudo_sendlog <resource> <action>` — Execute sudo_sendlog commands
- `sudo_sendlog self version` — Print sudo_sendlog version
- `sudo_sendlog _ _` — Passthrough to sudo_sendlog CLI

## Usage Examples
- "sudo_sendlog --help"
- "sudo_sendlog self version"

## Installation
```bash
apt-get install sudo_sendlog 2>/dev/null || which sudo_sendlog
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
