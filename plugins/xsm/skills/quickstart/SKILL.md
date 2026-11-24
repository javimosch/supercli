---
name: xsm
description: Use this skill when the user wants to use xsm, X session utilities.
---

# xsm Plugin

xsm — X session utilities.

## Commands
- `xsm <resource> <action>` — Execute xsm commands
- `xsm self version` — Print xsm version
- `xsm _ _` — Passthrough to xsm CLI

## Usage Examples
- "xsm --help"
- "xsm self version"

## Installation
```bash
apt-get install x11-session-utils 2>/dev/null || which xsm
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
