---
name: ctest
description: Use this skill when the user wants to use ctest, cli tool: ctest.
---

# ctest Plugin

CLI tool: ctest.

## Commands
- `ctest <resource> <action>` — Execute ctest commands
- `ctest self version` — Print ctest version
- `ctest _ _` — Passthrough to ctest CLI

## Usage Examples
- "ctest --help"
- "ctest self version"

## Installation
```bash
apt-get install ctest 2>/dev/null || which ctest
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
