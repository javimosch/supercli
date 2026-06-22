---
name: gcc-8
description: Use this skill when the user wants to use gcc-8, cli tool: gcc-8.
---

# gcc-8 Plugin

CLI tool: gcc-8.

## Commands
- `gcc-8 <resource> <action>` — Execute gcc-8 commands
- `gcc-8 self version` — Print gcc-8 version
- `gcc-8 _ _` — Passthrough to gcc-8 CLI

## Usage Examples
- "gcc-8 --help"
- "gcc-8 self version"

## Installation
```bash
apt-get install gcc-8 2>/dev/null || which gcc-8
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
