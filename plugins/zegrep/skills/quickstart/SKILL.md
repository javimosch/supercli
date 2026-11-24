---
name: zegrep
description: Use this skill when the user wants to use zegrep, GNU compression utilities.
---

# zegrep Plugin

zegrep — GNU compression utilities.

## Commands
- `zegrep <resource> <action>` — Execute zegrep commands
- `zegrep self version` — Print zegrep version
- `zegrep _ _` — Passthrough to zegrep CLI

## Usage Examples
- "zegrep --help"
- "zegrep self version"

## Installation
```bash
apt-get install gzip 2>/dev/null || which zegrep
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
