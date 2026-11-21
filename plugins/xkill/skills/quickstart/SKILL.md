---
name: xkill
description: Use this skill when the user wants to use xkill, X11 utilities.
---

# xkill Plugin

xkill — X11 utilities.

## Commands
- `xkill <resource> <action>` — Execute xkill commands
- `xkill self version` — Print xkill version
- `xkill _ _` — Passthrough to xkill CLI

## Usage Examples
- "xkill --help"
- "xkill self version"

## Installation
```bash
apt-get install x11-utils 2>/dev/null || which xkill
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
