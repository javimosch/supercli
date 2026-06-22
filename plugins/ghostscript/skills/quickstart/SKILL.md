---
name: ghostscript
description: Use this skill when the user wants to use ghostscript, cli tool: ghostscript.
---

# ghostscript Plugin

CLI tool: ghostscript.

## Commands
- `ghostscript <resource> <action>` — Execute ghostscript commands
- `ghostscript self version` — Print ghostscript version
- `ghostscript _ _` — Passthrough to ghostscript CLI

## Usage Examples
- "ghostscript --help"
- "ghostscript self version"

## Installation
```bash
apt-get install ghostscript 2>/dev/null || which ghostscript
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
