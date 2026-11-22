---
name: ctest
description: Use this skill when the user wants to use ctest, cross-platform, open-source make system.
---

# ctest Plugin

ctest — cross-platform, open-source make system.

## Commands
- `ctest <resource> <action>` — Execute ctest commands
- `ctest self version` — Print ctest version
- `ctest _ _` — Passthrough to ctest CLI

## Usage Examples
- "ctest --help"
- "ctest self version"

## Installation
```bash
apt-get install cmake 2>/dev/null || which ctest
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
