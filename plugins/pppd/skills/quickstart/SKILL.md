---
name: pppd
description: Use this skill when the user wants to use pppd, cli tool: pppd.
---

# pppd Plugin

CLI tool: pppd.

## Commands
- `pppd <resource> <action>` — Execute pppd commands
- `pppd self version` — Print pppd version
- `pppd _ _` — Passthrough to pppd CLI

## Usage Examples
- "pppd --help"
- "pppd self version"

## Installation
```bash
apt-get install pppd 2>/dev/null || which pppd
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
