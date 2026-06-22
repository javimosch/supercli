---
name: mysqlslap
description: Use this skill when the user wants to use mysqlslap, cli tool: mysqlslap.
---

# mysqlslap Plugin

CLI tool: mysqlslap.

## Commands
- `mysqlslap <resource> <action>` — Execute mysqlslap commands
- `mysqlslap self version` — Print mysqlslap version
- `mysqlslap _ _` — Passthrough to mysqlslap CLI

## Usage Examples
- "mysqlslap --help"
- "mysqlslap self version"

## Installation
```bash
apt-get install mysqlslap 2>/dev/null || which mysqlslap
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
