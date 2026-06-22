---
name: jstatd
description: Use this skill when the user wants to use jstatd, cli tool: jstatd.
---

# jstatd Plugin

CLI tool: jstatd.

## Commands
- `jstatd <resource> <action>` — Execute jstatd commands
- `jstatd self version` — Print jstatd version
- `jstatd _ _` — Passthrough to jstatd CLI

## Usage Examples
- "jstatd --help"
- "jstatd self version"

## Installation
```bash
apt-get install jstatd 2>/dev/null || which jstatd
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
