---
name: ntpd
description: Use this skill when the user wants to use ntpd, cli tool: ntpd.
---

# ntpd Plugin

CLI tool: ntpd.

## Commands
- `ntpd <resource> <action>` — Execute ntpd commands
- `ntpd self version` — Print ntpd version
- `ntpd _ _` — Passthrough to ntpd CLI

## Usage Examples
- "ntpd --help"
- "ntpd self version"

## Installation
```bash
apt-get install ntpd 2>/dev/null || which ntpd
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
