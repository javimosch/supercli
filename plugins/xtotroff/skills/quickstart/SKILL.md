---
name: xtotroff
description: Use this skill when the user wants to use xtotroff, GNU troff text-formatting system.
---

# xtotroff Plugin

xtotroff — GNU troff text-formatting system.

## Commands
- `xtotroff <resource> <action>` — Execute xtotroff commands
- `xtotroff self version` — Print xtotroff version
- `xtotroff _ _` — Passthrough to xtotroff CLI

## Usage Examples
- "xtotroff --help"
- "xtotroff self version"

## Installation
```bash
apt-get install groff 2>/dev/null || which xtotroff
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
