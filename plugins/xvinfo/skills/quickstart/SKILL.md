---
name: xvinfo
description: Use this skill when the user wants to use xvinfo, X11 utilities.
---

# xvinfo Plugin

xvinfo — X11 utilities.

## Commands
- `xvinfo <resource> <action>` — Execute xvinfo commands
- `xvinfo self version` — Print xvinfo version
- `xvinfo _ _` — Passthrough to xvinfo CLI

## Usage Examples
- "xvinfo --help"
- "xvinfo self version"

## Installation
```bash
apt-get install x11-utils 2>/dev/null || which xvinfo
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
