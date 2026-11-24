---
name: xinit
description: Use this skill when the user wants to use xinit, X server initialisation tool.
---

# xinit Plugin

X server initialisation tool.

## Commands
- `xinit <resource> <action>` — Execute xinit commands
- `xinit self version` — Print xinit version
- `xinit _ _` — Passthrough to xinit CLI

## Usage Examples
- "xinit --help"
- "xinit self version"

## Installation
```bash
apt-get install xinit 2>/dev/null || which xinit
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
