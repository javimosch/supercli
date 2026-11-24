---
name: xsetroot
description: Use this skill when the user wants to use xsetroot, X server utilities.
---

# xsetroot Plugin

xsetroot — X server utilities.

## Commands
- `xsetroot <resource> <action>` — Execute xsetroot commands
- `xsetroot self version` — Print xsetroot version
- `xsetroot _ _` — Passthrough to xsetroot CLI

## Usage Examples
- "xsetroot --help"
- "xsetroot self version"

## Installation
```bash
apt-get install x11-xserver-utils 2>/dev/null || which xsetroot
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
