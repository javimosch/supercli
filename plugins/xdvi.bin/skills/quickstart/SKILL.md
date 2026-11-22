---
name: xdvi.bin
description: Use this skill when the user wants to use xdvi.bin, Binaries for TeX Live.
---

# xdvi.bin Plugin

xdvi.bin — Binaries for TeX Live.

## Commands
- `xdvi.bin <resource> <action>` — Execute xdvi.bin commands
- `xdvi.bin self version` — Print xdvi.bin version
- `xdvi.bin _ _` — Passthrough to xdvi.bin CLI

## Usage Examples
- "xdvi.bin --help"
- "xdvi.bin self version"

## Installation
```bash
apt-get install texlive-binaries 2>/dev/null || which xdvi.bin
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
