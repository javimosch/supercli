---
name: setarch
description: Use this skill when the user wants to use setarch, cli tool: setarch.
---

# setarch Plugin

CLI tool: setarch.

## Commands
- `setarch <resource> <action>` — Execute setarch commands
- `setarch self version` — Print setarch version
- `setarch _ _` — Passthrough to setarch CLI

## Usage Examples
- "setarch --help"
- "setarch self version"

## Installation
```bash
apt-get install setarch 2>/dev/null || which setarch
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
