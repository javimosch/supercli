---
name: xfsettingsd
description: Use this skill when the user wants to use xfsettingsd, graphical application for managing Xfce settings.
---

# xfsettingsd Plugin

xfsettingsd — graphical application for managing Xfce settings.

## Commands
- `xfsettingsd <resource> <action>` — Execute xfsettingsd commands
- `xfsettingsd self version` — Print xfsettingsd version
- `xfsettingsd _ _` — Passthrough to xfsettingsd CLI

## Usage Examples
- "xfsettingsd --help"
- "xfsettingsd self version"

## Installation
```bash
apt-get install xfce4-settings 2>/dev/null || which xfsettingsd
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
