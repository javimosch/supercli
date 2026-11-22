---
name: dvipdft
description: Use this skill when the user wants to use dvipdft, Binaries for TeX Live.
---

# dvipdft Plugin

dvipdft — Binaries for TeX Live.

## Commands
- `dvipdft <resource> <action>` — Execute dvipdft commands
- `dvipdft self version` — Print dvipdft version
- `dvipdft _ _` — Passthrough to dvipdft CLI

## Usage Examples
- "dvipdft --help"
- "dvipdft self version"

## Installation
```bash
apt-get install texlive-binaries 2>/dev/null || which dvipdft
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
