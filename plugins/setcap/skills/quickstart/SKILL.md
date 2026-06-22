---
name: setcap
description: Use this skill when the user wants to use setcap, cli tool: setcap.
---

# setcap Plugin

CLI tool: setcap.

## Commands
- `setcap <resource> <action>` — Execute setcap commands
- `setcap self version` — Print setcap version
- `setcap _ _` — Passthrough to setcap CLI

## Usage Examples
- "setcap --help"
- "setcap self version"

## Installation
```bash
apt-get install setcap 2>/dev/null || which setcap
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
