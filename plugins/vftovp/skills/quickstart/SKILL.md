---
name: vftovp
description: Use this skill when the user wants to use vftovp, Binaries for TeX Live.
---

# vftovp Plugin

vftovp — Binaries for TeX Live.

## Commands
- `vftovp <resource> <action>` — Execute vftovp commands
- `vftovp self version` — Print vftovp version
- `vftovp _ _` — Passthrough to vftovp CLI

## Usage Examples
- "vftovp --help"
- "vftovp self version"

## Installation
```bash
apt-get install texlive-binaries 2>/dev/null || which vftovp
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
