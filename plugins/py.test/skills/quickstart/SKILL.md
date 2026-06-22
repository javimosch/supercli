---
name: py.test
description: Use this skill when the user wants to use py.test, cli tool: py.test.
---

# py.test Plugin

CLI tool: py.test.

## Commands
- `py.test <resource> <action>` — Execute py.test commands
- `py.test self version` — Print py.test version
- `py.test _ _` — Passthrough to py.test CLI

## Usage Examples
- "py.test --help"
- "py.test self version"

## Installation
```bash
apt-get install py.test 2>/dev/null || which py.test
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
