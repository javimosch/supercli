---
name: dvibook
description: Use this skill when the user wants to use dvibook, Binaries for TeX Live.
---

# dvibook Plugin

dvibook — Binaries for TeX Live.

## Commands
- `dvibook <resource> <action>` — Execute dvibook commands
- `dvibook self version` — Print dvibook version
- `dvibook _ _` — Passthrough to dvibook CLI

## Usage Examples
- "dvibook --help"
- "dvibook self version"

## Installation
```bash
apt-get install texlive-binaries 2>/dev/null || which dvibook
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
