---
name: msggrep
description: Use this skill when the user wants to use msggrep, cli tool: msggrep.
---

# msggrep Plugin

CLI tool: msggrep.

## Commands
- `msggrep <resource> <action>` — Execute msggrep commands
- `msggrep self version` — Print msggrep version
- `msggrep _ _` — Passthrough to msggrep CLI

## Usage Examples
- "msggrep --help"
- "msggrep self version"

## Installation
```bash
apt-get install msggrep 2>/dev/null || which msggrep
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
