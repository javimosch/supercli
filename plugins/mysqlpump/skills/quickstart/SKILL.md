---
name: mysqlpump
description: Use this skill when the user wants to use mysqlpump, cli tool: mysqlpump.
---

# mysqlpump Plugin

CLI tool: mysqlpump.

## Commands
- `mysqlpump <resource> <action>` — Execute mysqlpump commands
- `mysqlpump self version` — Print mysqlpump version
- `mysqlpump _ _` — Passthrough to mysqlpump CLI

## Usage Examples
- "mysqlpump --help"
- "mysqlpump self version"

## Installation
```bash
apt-get install mysqlpump 2>/dev/null || which mysqlpump
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
