---
name: xzcmp
description: Use this skill when the user wants to use xzcmp, XZ-format compression utilities.
---

# xzcmp Plugin

xzcmp — XZ-format compression utilities.

## Commands
- `xzcmp <resource> <action>` — Execute xzcmp commands
- `xzcmp self version` — Print xzcmp version
- `xzcmp _ _` — Passthrough to xzcmp CLI

## Usage Examples
- "xzcmp --help"
- "xzcmp self version"

## Installation
```bash
apt-get install xz-utils 2>/dev/null || which xzcmp
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
