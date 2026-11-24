---
name: xkbbell
description: Use this skill when the user wants to use xkbbell, X11 XKB utilities.
---

# xkbbell Plugin

xkbbell — X11 XKB utilities.

## Commands
- `xkbbell <resource> <action>` — Execute xkbbell commands
- `xkbbell self version` — Print xkbbell version
- `xkbbell _ _` — Passthrough to xkbbell CLI

## Usage Examples
- "xkbbell --help"
- "xkbbell self version"

## Installation
```bash
apt-get install x11-xkb-utils 2>/dev/null || which xkbbell
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
