---
name: msgfmt
description: Use this skill when the user wants to use msgfmt, cli tool: msgfmt.
---

# msgfmt Plugin

CLI tool: msgfmt.

## Commands
- `msgfmt <resource> <action>` — Execute msgfmt commands
- `msgfmt self version` — Print msgfmt version
- `msgfmt _ _` — Passthrough to msgfmt CLI

## Usage Examples
- "msgfmt --help"
- "msgfmt self version"

## Installation
```bash
apt-get install msgfmt 2>/dev/null || which msgfmt
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
