---
name: xdvi-xaw
description: Use this skill when the user wants to use xdvi-xaw, Binaries for TeX Live.
---

# xdvi-xaw Plugin

xdvi-xaw — Binaries for TeX Live.

## Commands
- `xdvi-xaw <resource> <action>` — Execute xdvi-xaw commands
- `xdvi-xaw self version` — Print xdvi-xaw version
- `xdvi-xaw _ _` — Passthrough to xdvi-xaw CLI

## Usage Examples
- "xdvi-xaw --help"
- "xdvi-xaw self version"

## Installation
```bash
apt-get install texlive-binaries 2>/dev/null || which xdvi-xaw
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
