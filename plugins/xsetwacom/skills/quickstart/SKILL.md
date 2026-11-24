---
name: xsetwacom
description: Use this skill when the user wants to use xsetwacom, X.Org X server -- Wacom input driver.
---

# xsetwacom Plugin

xsetwacom — X.Org X server -- Wacom input driver.

## Commands
- `xsetwacom <resource> <action>` — Execute xsetwacom commands
- `xsetwacom self version` — Print xsetwacom version
- `xsetwacom _ _` — Passthrough to xsetwacom CLI

## Usage Examples
- "xsetwacom --help"
- "xsetwacom self version"

## Installation
```bash
apt-get install xserver-xorg-input-wacom 2>/dev/null || which xsetwacom
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
