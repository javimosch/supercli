---
name: mysqlrepair
description: Use this skill when the user wants to use mysqlrepair, cli tool: mysqlrepair.
---

# mysqlrepair Plugin

CLI tool: mysqlrepair.

## Commands
- `mysqlrepair <resource> <action>` — Execute mysqlrepair commands
- `mysqlrepair self version` — Print mysqlrepair version
- `mysqlrepair _ _` — Passthrough to mysqlrepair CLI

## Usage Examples
- "mysqlrepair --help"
- "mysqlrepair self version"

## Installation
```bash
apt-get install mysqlrepair 2>/dev/null || which mysqlrepair
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
