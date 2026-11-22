---
name: xfce4-kiosk-query
description: Use this skill when the user wants to use xfce4-kiosk-query, tools for libxfce4util.
---

# xfce4-kiosk-query Plugin

xfce4-kiosk-query — tools for libxfce4util.

## Commands
- `xfce4-kiosk-query <resource> <action>` — Execute xfce4-kiosk-query commands
- `xfce4-kiosk-query self version` — Print xfce4-kiosk-query version
- `xfce4-kiosk-query _ _` — Passthrough to xfce4-kiosk-query CLI

## Usage Examples
- "xfce4-kiosk-query --help"
- "xfce4-kiosk-query self version"

## Installation
```bash
apt-get install libxfce4util-bin 2>/dev/null || which xfce4-kiosk-query
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
