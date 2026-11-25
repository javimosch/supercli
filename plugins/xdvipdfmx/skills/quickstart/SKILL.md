---
name: xdvipdfmx
description: Use this skill when the user wants to use xdvipdfmx, Binaries for TeX Live.
---

# xdvipdfmx Plugin

xdvipdfmx — Binaries for TeX Live.

## Commands
- `xdvipdfmx <resource> <action>` — Execute xdvipdfmx commands
- `xdvipdfmx self version` — Print xdvipdfmx version
- `xdvipdfmx _ _` — Passthrough to xdvipdfmx CLI

## Usage Examples
- "xdvipdfmx --help"
- "xdvipdfmx self version"

## Installation
```bash
apt-get install texlive-binaries 2>/dev/null || which xdvipdfmx
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
