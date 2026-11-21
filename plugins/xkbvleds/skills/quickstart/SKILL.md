---
name: xkbvleds
description: Use this skill when the user wants to use xkbvleds, X11 XKB utilities.
---

# xkbvleds Plugin

xkbvleds — X11 XKB utilities.

## Commands
- `xkbvleds <resource> <action>` — Execute xkbvleds commands
- `xkbvleds self version` — Print xkbvleds version
- `xkbvleds _ _` — Passthrough to xkbvleds CLI

## Usage Examples
- "xkbvleds --help"
- "xkbvleds self version"

## Installation
```bash
apt-get install x11-xkb-utils 2>/dev/null || which xkbvleds
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
