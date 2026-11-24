---
name: xsetpointer
description: Use this skill when the user wants to use xsetpointer, X server utilities.
---

# xsetpointer Plugin

xsetpointer — X server utilities.

## Commands
- `xsetpointer <resource> <action>` — Execute xsetpointer commands
- `xsetpointer self version` — Print xsetpointer version
- `xsetpointer _ _` — Passthrough to xsetpointer CLI

## Usage Examples
- "xsetpointer --help"
- "xsetpointer self version"

## Installation
```bash
apt-get install x11-xserver-utils 2>/dev/null || which xsetpointer
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
