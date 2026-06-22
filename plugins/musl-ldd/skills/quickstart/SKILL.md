---
name: musl-ldd
description: Use this skill when the user wants to use musl-ldd, cli tool: musl-ldd.
---

# musl-ldd Plugin

CLI tool: musl-ldd.

## Commands
- `musl-ldd <resource> <action>` — Execute musl-ldd commands
- `musl-ldd self version` — Print musl-ldd version
- `musl-ldd _ _` — Passthrough to musl-ldd CLI

## Usage Examples
- "musl-ldd --help"
- "musl-ldd self version"

## Installation
```bash
apt-get install musl-ldd 2>/dev/null || which musl-ldd
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
