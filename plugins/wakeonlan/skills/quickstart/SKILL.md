---
name: wakeonlan
description: Use this skill when the user wants to use wakeonlan, cli tool: wakeonlan.
---

# wakeonlan Plugin

CLI tool: wakeonlan.

## Commands
- `wakeonlan <resource> <action>` — Execute wakeonlan commands
- `wakeonlan self version` — Print wakeonlan version
- `wakeonlan _ _` — Passthrough to wakeonlan CLI

## Usage Examples
- "wakeonlan --help"
- "wakeonlan self version"

## Installation
```bash
apt-get install wakeonlan 2>/dev/null || which wakeonlan
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
