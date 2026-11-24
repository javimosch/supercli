---
name: xfconf-query
description: Use this skill when the user wants to use xfconf-query, utilities for managing settings in Xfce.
---

# xfconf-query Plugin

xfconf-query — utilities for managing settings in Xfce.

## Commands
- `xfconf-query <resource> <action>` — Execute xfconf-query commands
- `xfconf-query self version` — Print xfconf-query version
- `xfconf-query _ _` — Passthrough to xfconf-query CLI

## Usage Examples
- "xfconf-query --help"
- "xfconf-query self version"

## Installation
```bash
apt-get install xfconf 2>/dev/null || which xfconf-query
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
