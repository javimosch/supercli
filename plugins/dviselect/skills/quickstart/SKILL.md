---
name: dviselect
description: Use this skill when the user wants to use dviselect, Binaries for TeX Live.
---

# dviselect Plugin

dviselect — Binaries for TeX Live.

## Commands
- `dviselect <resource> <action>` — Execute dviselect commands
- `dviselect self version` — Print dviselect version
- `dviselect _ _` — Passthrough to dviselect CLI

## Usage Examples
- "dviselect --help"
- "dviselect self version"

## Installation
```bash
apt-get install texlive-binaries 2>/dev/null || which dviselect
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
