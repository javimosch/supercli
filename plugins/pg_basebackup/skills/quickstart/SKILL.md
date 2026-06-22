---
name: pg_basebackup
description: Use this skill when the user wants to use pg_basebackup, cli tool: pg_basebackup.
---

# pg_basebackup Plugin

CLI tool: pg_basebackup.

## Commands
- `pg_basebackup <resource> <action>` — Execute pg_basebackup commands
- `pg_basebackup self version` — Print pg_basebackup version
- `pg_basebackup _ _` — Passthrough to pg_basebackup CLI

## Usage Examples
- "pg_basebackup --help"
- "pg_basebackup self version"

## Installation
```bash
apt-get install pg_basebackup 2>/dev/null || which pg_basebackup
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
