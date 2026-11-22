---
name: xdg-settings
description: Use this skill when the user wants to use xdg-settings, desktop integration utilities from freedesktop.org.
---

# xdg-settings Plugin

xdg-settings — desktop integration utilities from freedesktop.org.

## Commands
- `xdg-settings <resource> <action>` — Execute xdg-settings commands
- `xdg-settings self version` — Print xdg-settings version
- `xdg-settings _ _` — Passthrough to xdg-settings CLI

## Usage Examples
- "xdg-settings --help"
- "xdg-settings self version"

## Installation
```bash
apt-get install xdg-utils 2>/dev/null || which xdg-settings
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
