---
name: zdump
description: Use this skill when the user wants to use zdump, cli tool: zdump.
---

# zdump Plugin

CLI tool: zdump.

## Commands
- `zdump <resource> <action>` — Execute zdump commands
- `zdump self version` — Print zdump version
- `zdump _ _` — Passthrough to zdump CLI

## Usage Examples
- "zdump --help"
- "zdump self version"

## Installation
```bash
apt-get install zdump 2>/dev/null || which zdump
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
