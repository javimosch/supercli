---
name: zcmp
description: Use this skill when the user wants to use zcmp, GNU compression utilities.
---

# zcmp Plugin

zcmp — GNU compression utilities.

## Commands
- `zcmp <resource> <action>` — Execute zcmp commands
- `zcmp self version` — Print zcmp version
- `zcmp _ _` — Passthrough to zcmp CLI

## Usage Examples
- "zcmp --help"
- "zcmp self version"

## Installation
```bash
apt-get install gzip 2>/dev/null || which zcmp
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
