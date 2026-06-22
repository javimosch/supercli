---
name: shutdown
description: Use this skill when the user wants to use shutdown, cli tool: shutdown.
---

# shutdown Plugin

CLI tool: shutdown.

## Commands
- `shutdown <resource> <action>` — Execute shutdown commands
- `shutdown self version` — Print shutdown version
- `shutdown _ _` — Passthrough to shutdown CLI

## Usage Examples
- "shutdown --help"
- "shutdown self version"

## Installation
```bash
apt-get install shutdown 2>/dev/null || which shutdown
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
