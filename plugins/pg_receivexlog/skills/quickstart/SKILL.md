---
name: pg_receivexlog
description: Use this skill when the user wants to use pg_receivexlog, cli tool: pg_receivexlog.
---

# pg_receivexlog Plugin

CLI tool: pg_receivexlog.

## Commands
- `pg_receivexlog <resource> <action>` — Execute pg_receivexlog commands
- `pg_receivexlog self version` — Print pg_receivexlog version
- `pg_receivexlog _ _` — Passthrough to pg_receivexlog CLI

## Usage Examples
- "pg_receivexlog --help"
- "pg_receivexlog self version"

## Installation
```bash
apt-get install pg_receivexlog 2>/dev/null || which pg_receivexlog
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
