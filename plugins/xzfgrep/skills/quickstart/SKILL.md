---
name: xzfgrep
description: Use this skill when the user wants to use xzfgrep, XZ-format compression utilities.
---

# xzfgrep Plugin

xzfgrep — XZ-format compression utilities.

## Commands
- `xzfgrep <resource> <action>` — Execute xzfgrep commands
- `xzfgrep self version` — Print xzfgrep version
- `xzfgrep _ _` — Passthrough to xzfgrep CLI

## Usage Examples
- "xzfgrep --help"
- "xzfgrep self version"

## Installation
```bash
apt-get install xz-utils 2>/dev/null || which xzfgrep
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
