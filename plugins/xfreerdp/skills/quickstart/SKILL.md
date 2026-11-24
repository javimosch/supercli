---
name: xfreerdp
description: Use this skill when the user wants to use xfreerdp, RDP client for Windows Terminal Services (X11 client).
---

# xfreerdp Plugin

xfreerdp — RDP client for Windows Terminal Services (X11 client).

## Commands
- `xfreerdp <resource> <action>` — Execute xfreerdp commands
- `xfreerdp self version` — Print xfreerdp version
- `xfreerdp _ _` — Passthrough to xfreerdp CLI

## Usage Examples
- "xfreerdp --help"
- "xfreerdp self version"

## Installation
```bash
apt-get install freerdp2-x11 2>/dev/null || which xfreerdp
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
