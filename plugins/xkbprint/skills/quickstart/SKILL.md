---
name: xkbprint
description: Use this skill when the user wants to use xkbprint, X11 XKB utilities.
---

# xkbprint Plugin

xkbprint — X11 XKB utilities.

## Commands
- `xkbprint <resource> <action>` — Execute xkbprint commands
- `xkbprint self version` — Print xkbprint version
- `xkbprint _ _` — Passthrough to xkbprint CLI

## Usage Examples
- "xkbprint --help"
- "xkbprint self version"

## Installation
```bash
apt-get install x11-xkb-utils 2>/dev/null || which xkbprint
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
