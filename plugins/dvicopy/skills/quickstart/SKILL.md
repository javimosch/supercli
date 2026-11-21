---
name: dvicopy
description: Use this skill when the user wants to use dvicopy, Binaries for TeX Live.
---

# dvicopy Plugin

dvicopy — Binaries for TeX Live.

## Commands
- `dvicopy <resource> <action>` — Execute dvicopy commands
- `dvicopy self version` — Print dvicopy version
- `dvicopy _ _` — Passthrough to dvicopy CLI

## Usage Examples
- "dvicopy --help"
- "dvicopy self version"

## Installation
```bash
apt-get install texlive-binaries 2>/dev/null || which dvicopy
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
