---
name: insmod
description: Use this skill when the user wants to use insmod, cli tool: insmod.
---

# insmod Plugin

CLI tool: insmod.

## Commands
- `insmod <resource> <action>` — Execute insmod commands
- `insmod self version` — Print insmod version
- `insmod _ _` — Passthrough to insmod CLI

## Usage Examples
- "insmod --help"
- "insmod self version"

## Installation
```bash
apt-get install insmod 2>/dev/null || which insmod
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
