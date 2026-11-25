---
name: wakeonlan
description: Use this skill when the user wants to use wakeonlan, Sends 'magic packets' to wake-on-LAN enabled ethernet adapters.
---

# wakeonlan Plugin

Sends 'magic packets' to wake-on-LAN enabled ethernet adapters.

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
