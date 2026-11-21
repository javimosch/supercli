---
name: dt2dv
description: Use this skill when the user wants to use dt2dv, Binaries for TeX Live.
---

# dt2dv Plugin

dt2dv — Binaries for TeX Live.

## Commands
- `dt2dv <resource> <action>` — Execute dt2dv commands
- `dt2dv self version` — Print dt2dv version
- `dt2dv _ _` — Passthrough to dt2dv CLI

## Usage Examples
- "dt2dv --help"
- "dt2dv self version"

## Installation
```bash
apt-get install texlive-binaries 2>/dev/null || which dt2dv
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
