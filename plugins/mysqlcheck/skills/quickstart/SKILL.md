---
name: mysqlcheck
description: Use this skill when the user wants to use mysqlcheck, cli tool: mysqlcheck.
---

# mysqlcheck Plugin

CLI tool: mysqlcheck.

## Commands
- `mysqlcheck <resource> <action>` — Execute mysqlcheck commands
- `mysqlcheck self version` — Print mysqlcheck version
- `mysqlcheck _ _` — Passthrough to mysqlcheck CLI

## Usage Examples
- "mysqlcheck --help"
- "mysqlcheck self version"

## Installation
```bash
apt-get install mysqlcheck 2>/dev/null || which mysqlcheck
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
