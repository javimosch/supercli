---
name: zfgrep
description: Use this skill when the user wants to use zfgrep, GNU compression utilities.
---

# zfgrep Plugin

zfgrep — GNU compression utilities.

## Commands
- `zfgrep <resource> <action>` — Execute zfgrep commands
- `zfgrep self version` — Print zfgrep version
- `zfgrep _ _` — Passthrough to zfgrep CLI

## Usage Examples
- "zfgrep --help"
- "zfgrep self version"

## Installation
```bash
apt-get install gzip 2>/dev/null || which zfgrep
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
