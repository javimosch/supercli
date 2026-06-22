---
name: setfacl
description: Use this skill when the user wants to use setfacl, cli tool: setfacl.
---

# setfacl Plugin

CLI tool: setfacl.

## Commands
- `setfacl <resource> <action>` — Execute setfacl commands
- `setfacl self version` — Print setfacl version
- `setfacl _ _` — Passthrough to setfacl CLI

## Usage Examples
- "setfacl --help"
- "setfacl self version"

## Installation
```bash
apt-get install setfacl 2>/dev/null || which setfacl
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
