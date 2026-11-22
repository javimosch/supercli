---
name: dvispc
description: Use this skill when the user wants to use dvispc, Binaries for TeX Live.
---

# dvispc Plugin

dvispc — Binaries for TeX Live.

## Commands
- `dvispc <resource> <action>` — Execute dvispc commands
- `dvispc self version` — Print dvispc version
- `dvispc _ _` — Passthrough to dvispc CLI

## Usage Examples
- "dvispc --help"
- "dvispc self version"

## Installation
```bash
apt-get install texlive-binaries 2>/dev/null || which dvispc
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
