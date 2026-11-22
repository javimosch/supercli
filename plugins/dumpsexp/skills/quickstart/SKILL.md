---
name: dumpsexp
description: Use this skill when the user wants to use dumpsexp, LGPL Crypto library - development files.
---

# dumpsexp Plugin

dumpsexp — LGPL Crypto library - development files.

## Commands
- `dumpsexp <resource> <action>` — Execute dumpsexp commands
- `dumpsexp self version` — Print dumpsexp version
- `dumpsexp _ _` — Passthrough to dumpsexp CLI

## Usage Examples
- "dumpsexp --help"
- "dumpsexp self version"

## Installation
```bash
apt-get install libgcrypt20-dev 2>/dev/null || which dumpsexp
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
