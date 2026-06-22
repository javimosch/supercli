---
name: hp-check
description: Use this skill when the user wants to use hp-check, cli tool: hp-check.
---

# hp-check Plugin

CLI tool: hp-check.

## Commands
- `hp-check <resource> <action>` — Execute hp-check commands
- `hp-check self version` — Print hp-check version
- `hp-check _ _` — Passthrough to hp-check CLI

## Usage Examples
- "hp-check --help"
- "hp-check self version"

## Installation
```bash
apt-get install hp-check 2>/dev/null || which hp-check
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
