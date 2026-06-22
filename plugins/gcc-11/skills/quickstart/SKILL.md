---
name: gcc-11
description: Use this skill when the user wants to use gcc-11, cli tool: gcc-11.
---

# gcc-11 Plugin

CLI tool: gcc-11.

## Commands
- `gcc-11 <resource> <action>` — Execute gcc-11 commands
- `gcc-11 self version` — Print gcc-11 version
- `gcc-11 _ _` — Passthrough to gcc-11 CLI

## Usage Examples
- "gcc-11 --help"
- "gcc-11 self version"

## Installation
```bash
apt-get install gcc-11 2>/dev/null || which gcc-11
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
