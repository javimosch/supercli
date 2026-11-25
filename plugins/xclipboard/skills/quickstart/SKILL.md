---
name: xclipboard
description: Use this skill when the user wants to use xclipboard, X applications.
---

# xclipboard Plugin

xclipboard — X applications.

## Commands
- `xclipboard <resource> <action>` — Execute xclipboard commands
- `xclipboard self version` — Print xclipboard version
- `xclipboard _ _` — Passthrough to xclipboard CLI

## Usage Examples
- "xclipboard --help"
- "xclipboard self version"

## Installation
```bash
apt-get install x11-apps 2>/dev/null || which xclipboard
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
