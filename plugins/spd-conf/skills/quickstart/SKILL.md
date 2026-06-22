---
name: spd-conf
description: Use this skill when the user wants to use spd-conf, cli tool: spd-conf.
---

# spd-conf Plugin

CLI tool: spd-conf.

## Commands
- `spd-conf <resource> <action>` — Execute spd-conf commands
- `spd-conf self version` — Print spd-conf version
- `spd-conf _ _` — Passthrough to spd-conf CLI

## Usage Examples
- "spd-conf --help"
- "spd-conf self version"

## Installation
```bash
apt-get install spd-conf 2>/dev/null || which spd-conf
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
