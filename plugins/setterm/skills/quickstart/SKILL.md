---
name: setterm
description: Use this skill when the user wants to use setterm, cli tool: setterm.
---

# setterm Plugin

CLI tool: setterm.

## Commands
- `setterm <resource> <action>` — Execute setterm commands
- `setterm self version` — Print setterm version
- `setterm _ _` — Passthrough to setterm CLI

## Usage Examples
- "setterm --help"
- "setterm self version"

## Installation
```bash
apt-get install setterm 2>/dev/null || which setterm
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
