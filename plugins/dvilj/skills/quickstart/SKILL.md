---
name: dvilj
description: Use this skill when the user wants to use dvilj, Binaries for TeX Live.
---

# dvilj Plugin

dvilj — Binaries for TeX Live.

## Commands
- `dvilj <resource> <action>` — Execute dvilj commands
- `dvilj self version` — Print dvilj version
- `dvilj _ _` — Passthrough to dvilj CLI

## Usage Examples
- "dvilj --help"
- "dvilj self version"

## Installation
```bash
apt-get install texlive-binaries 2>/dev/null || which dvilj
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
