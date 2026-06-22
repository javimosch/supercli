---
name: mysqlimport
description: Use this skill when the user wants to use mysqlimport, cli tool: mysqlimport.
---

# mysqlimport Plugin

CLI tool: mysqlimport.

## Commands
- `mysqlimport <resource> <action>` — Execute mysqlimport commands
- `mysqlimport self version` — Print mysqlimport version
- `mysqlimport _ _` — Passthrough to mysqlimport CLI

## Usage Examples
- "mysqlimport --help"
- "mysqlimport self version"

## Installation
```bash
apt-get install mysqlimport 2>/dev/null || which mysqlimport
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
