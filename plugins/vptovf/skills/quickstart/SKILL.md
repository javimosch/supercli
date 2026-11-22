---
name: vptovf
description: Use this skill when the user wants to use vptovf, Binaries for TeX Live.
---

# vptovf Plugin

vptovf — Binaries for TeX Live.

## Commands
- `vptovf <resource> <action>` — Execute vptovf commands
- `vptovf self version` — Print vptovf version
- `vptovf _ _` — Passthrough to vptovf CLI

## Usage Examples
- "vptovf --help"
- "vptovf self version"

## Installation
```bash
apt-get install texlive-binaries 2>/dev/null || which vptovf
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
