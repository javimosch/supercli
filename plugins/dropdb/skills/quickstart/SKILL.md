---
name: dropdb
description: Use this skill when the user wants to use dropdb, manager for multiple PostgreSQL client versions.
---

# dropdb Plugin

dropdb — manager for multiple PostgreSQL client versions.

## Commands
- `dropdb <resource> <action>` — Execute dropdb commands
- `dropdb self version` — Print dropdb version
- `dropdb _ _` — Passthrough to dropdb CLI

## Usage Examples
- "dropdb --help"
- "dropdb self version"

## Installation
```bash
apt-get install postgresql-client-common 2>/dev/null || which dropdb
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
