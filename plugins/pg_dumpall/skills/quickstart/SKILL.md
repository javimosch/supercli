---
name: pg_dumpall
description: Use this skill when the user wants to use pg_dumpall, cli tool: pg_dumpall.
---

# pg_dumpall Plugin

CLI tool: pg_dumpall.

## Commands
- `pg_dumpall <resource> <action>` — Execute pg_dumpall commands
- `pg_dumpall self version` — Print pg_dumpall version
- `pg_dumpall _ _` — Passthrough to pg_dumpall CLI

## Usage Examples
- "pg_dumpall --help"
- "pg_dumpall self version"

## Installation
```bash
apt-get install pg_dumpall 2>/dev/null || which pg_dumpall
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
