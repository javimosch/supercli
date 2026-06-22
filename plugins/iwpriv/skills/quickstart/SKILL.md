---
name: iwpriv
description: Use this skill when the user wants to use iwpriv, cli tool: iwpriv.
---

# iwpriv Plugin

CLI tool: iwpriv.

## Commands
- `iwpriv <resource> <action>` — Execute iwpriv commands
- `iwpriv self version` — Print iwpriv version
- `iwpriv _ _` — Passthrough to iwpriv CLI

## Usage Examples
- "iwpriv --help"
- "iwpriv self version"

## Installation
```bash
apt-get install iwpriv 2>/dev/null || which iwpriv
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
