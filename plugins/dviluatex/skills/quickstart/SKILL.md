---
name: dviluatex
description: Use this skill when the user wants to use dviluatex, TeX Live: Essential programs and files.
---

# dviluatex Plugin

dviluatex — TeX Live: Essential programs and files.

## Commands
- `dviluatex <resource> <action>` — Execute dviluatex commands
- `dviluatex self version` — Print dviluatex version
- `dviluatex _ _` — Passthrough to dviluatex CLI

## Usage Examples
- "dviluatex --help"
- "dviluatex self version"

## Installation
```bash
apt-get install texlive-base 2>/dev/null || which dviluatex
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
