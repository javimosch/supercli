---
name: xetex
description: Use this skill when the user wants to use xetex, Binaries for TeX Live.
---

# xetex Plugin

xetex — Binaries for TeX Live.

## Commands
- `xetex <resource> <action>` — Execute xetex commands
- `xetex self version` — Print xetex version
- `xetex _ _` — Passthrough to xetex CLI

## Usage Examples
- "xetex --help"
- "xetex self version"

## Installation
```bash
apt-get install texlive-binaries 2>/dev/null || which xetex
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
