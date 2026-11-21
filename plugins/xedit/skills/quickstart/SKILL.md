---
name: xedit
description: Use this skill when the user wants to use xedit, X applications.
---

# xedit Plugin

xedit — X applications.

## Commands
- `xedit <resource> <action>` — Execute xedit commands
- `xedit self version` — Print xedit version
- `xedit _ _` — Passthrough to xedit CLI

## Usage Examples
- "xedit --help"
- "xedit self version"

## Installation
```bash
apt-get install x11-apps 2>/dev/null || which xedit
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
