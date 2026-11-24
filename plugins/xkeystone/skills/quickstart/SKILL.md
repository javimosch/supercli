---
name: xkeystone
description: Use this skill when the user wants to use xkeystone, X server utilities.
---

# xkeystone Plugin

xkeystone — X server utilities.

## Commands
- `xkeystone <resource> <action>` — Execute xkeystone commands
- `xkeystone self version` — Print xkeystone version
- `xkeystone _ _` — Passthrough to xkeystone CLI

## Usage Examples
- "xkeystone --help"
- "xkeystone self version"

## Installation
```bash
apt-get install x11-xserver-utils 2>/dev/null || which xkeystone
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
