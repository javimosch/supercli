---
name: signtool
description: Use this skill when the user wants to use signtool, cli tool: signtool.
---

# signtool Plugin

CLI tool: signtool.

## Commands
- `signtool <resource> <action>` — Execute signtool commands
- `signtool self version` — Print signtool version
- `signtool _ _` — Passthrough to signtool CLI

## Usage Examples
- "signtool --help"
- "signtool self version"

## Installation
```bash
apt-get install signtool 2>/dev/null || which signtool
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
