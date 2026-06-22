---
name: gcc-9
description: Use this skill when the user wants to use gcc-9, cli tool: gcc-9.
---

# gcc-9 Plugin

CLI tool: gcc-9.

## Commands
- `gcc-9 <resource> <action>` — Execute gcc-9 commands
- `gcc-9 self version` — Print gcc-9 version
- `gcc-9 _ _` — Passthrough to gcc-9 CLI

## Usage Examples
- "gcc-9 --help"
- "gcc-9 self version"

## Installation
```bash
apt-get install gcc-9 2>/dev/null || which gcc-9
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
