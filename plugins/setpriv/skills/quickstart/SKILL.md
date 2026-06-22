---
name: setpriv
description: Use this skill when the user wants to use setpriv, cli tool: setpriv.
---

# setpriv Plugin

CLI tool: setpriv.

## Commands
- `setpriv <resource> <action>` — Execute setpriv commands
- `setpriv self version` — Print setpriv version
- `setpriv _ _` — Passthrough to setpriv CLI

## Usage Examples
- "setpriv --help"
- "setpriv self version"

## Installation
```bash
apt-get install setpriv 2>/dev/null || which setpriv
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
