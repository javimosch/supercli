---
name: musl-gcc
description: Use this skill when the user wants to use musl-gcc, cli tool: musl-gcc.
---

# musl-gcc Plugin

CLI tool: musl-gcc.

## Commands
- `musl-gcc <resource> <action>` — Execute musl-gcc commands
- `musl-gcc self version` — Print musl-gcc version
- `musl-gcc _ _` — Passthrough to musl-gcc CLI

## Usage Examples
- "musl-gcc --help"
- "musl-gcc self version"

## Installation
```bash
apt-get install musl-gcc 2>/dev/null || which musl-gcc
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
