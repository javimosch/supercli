---
name: pg_isready
description: Use this skill when the user wants to use pg_isready, cli tool: pg_isready.
---

# pg_isready Plugin

CLI tool: pg_isready.

## Commands
- `pg_isready <resource> <action>` — Execute pg_isready commands
- `pg_isready self version` — Print pg_isready version
- `pg_isready _ _` — Passthrough to pg_isready CLI

## Usage Examples
- "pg_isready --help"
- "pg_isready self version"

## Installation
```bash
apt-get install pg_isready 2>/dev/null || which pg_isready
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
