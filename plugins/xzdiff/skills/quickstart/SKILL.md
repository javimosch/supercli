---
name: xzdiff
description: Use this skill when the user wants to use xzdiff, XZ-format compression utilities.
---

# xzdiff Plugin

xzdiff — XZ-format compression utilities.

## Commands
- `xzdiff <resource> <action>` — Execute xzdiff commands
- `xzdiff self version` — Print xzdiff version
- `xzdiff _ _` — Passthrough to xzdiff CLI

## Usage Examples
- "xzdiff --help"
- "xzdiff self version"

## Installation
```bash
apt-get install xz-utils 2>/dev/null || which xzdiff
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
