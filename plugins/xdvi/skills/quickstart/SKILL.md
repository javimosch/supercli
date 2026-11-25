---
name: xdvi
description: Use this skill when the user wants to use xdvi, Binaries for TeX Live.
---

# xdvi Plugin

xdvi — Binaries for TeX Live.

## Commands
- `xdvi <resource> <action>` — Execute xdvi commands
- `xdvi self version` — Print xdvi version
- `xdvi _ _` — Passthrough to xdvi CLI

## Usage Examples
- "xdvi --help"
- "xdvi self version"

## Installation
```bash
apt-get install texlive-binaries 2>/dev/null || which xdvi
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
