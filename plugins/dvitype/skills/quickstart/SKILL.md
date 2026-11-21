---
name: dvitype
description: Use this skill when the user wants to use dvitype, Binaries for TeX Live.
---

# dvitype Plugin

dvitype — Binaries for TeX Live.

## Commands
- `dvitype <resource> <action>` — Execute dvitype commands
- `dvitype self version` — Print dvitype version
- `dvitype _ _` — Passthrough to dvitype CLI

## Usage Examples
- "dvitype --help"
- "dvitype self version"

## Installation
```bash
apt-get install texlive-binaries 2>/dev/null || which dvitype
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
