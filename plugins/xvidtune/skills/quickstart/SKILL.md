---
name: xvidtune
description: Use this skill when the user wants to use xvidtune, X server utilities.
---

# xvidtune Plugin

xvidtune — X server utilities.

## Commands
- `xvidtune <resource> <action>` — Execute xvidtune commands
- `xvidtune self version` — Print xvidtune version
- `xvidtune _ _` — Passthrough to xvidtune CLI

## Usage Examples
- "xvidtune --help"
- "xvidtune self version"

## Installation
```bash
apt-get install x11-xserver-utils 2>/dev/null || which xvidtune
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
