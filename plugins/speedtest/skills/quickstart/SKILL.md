---
name: speedtest
description: Use this skill when the user wants to use speedtest, cli tool: speedtest.
---

# speedtest Plugin

CLI tool: speedtest.

## Commands
- `speedtest <resource> <action>` — Execute speedtest commands
- `speedtest self version` — Print speedtest version
- `speedtest _ _` — Passthrough to speedtest CLI

## Usage Examples
- "speedtest --help"
- "speedtest self version"

## Installation
```bash
apt-get install speedtest 2>/dev/null || which speedtest
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
