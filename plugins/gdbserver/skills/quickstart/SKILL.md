---
name: gdbserver
description: Use this skill when the user wants to use gdbserver, cli tool: gdbserver.
---

# gdbserver Plugin

CLI tool: gdbserver.

## Commands
- `gdbserver <resource> <action>` — Execute gdbserver commands
- `gdbserver self version` — Print gdbserver version
- `gdbserver _ _` — Passthrough to gdbserver CLI

## Usage Examples
- "gdbserver --help"
- "gdbserver self version"

## Installation
```bash
apt-get install gdbserver 2>/dev/null || which gdbserver
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
