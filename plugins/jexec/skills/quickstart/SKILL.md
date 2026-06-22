---
name: jexec
description: Use this skill when the user wants to use jexec, cli tool: jexec.
---

# jexec Plugin

CLI tool: jexec.

## Commands
- `jexec <resource> <action>` — Execute jexec commands
- `jexec self version` — Print jexec version
- `jexec _ _` — Passthrough to jexec CLI

## Usage Examples
- "jexec --help"
- "jexec self version"

## Installation
```bash
apt-get install jexec 2>/dev/null || which jexec
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
