---
name: xstdcmap
description: Use this skill when the user wants to use xstdcmap, X server utilities.
---

# xstdcmap Plugin

xstdcmap — X server utilities.

## Commands
- `xstdcmap <resource> <action>` — Execute xstdcmap commands
- `xstdcmap self version` — Print xstdcmap version
- `xstdcmap _ _` — Passthrough to xstdcmap CLI

## Usage Examples
- "xstdcmap --help"
- "xstdcmap self version"

## Installation
```bash
apt-get install x11-xserver-utils 2>/dev/null || which xstdcmap
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
