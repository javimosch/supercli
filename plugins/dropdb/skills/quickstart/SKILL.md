---
name: dropdb
description: Use this skill when the user wants to use dropdb, cli tool: dropdb.
---

# dropdb Plugin

CLI tool: dropdb.

## Commands
- `dropdb <resource> <action>` — Execute dropdb commands
- `dropdb self version` — Print dropdb version
- `dropdb _ _` — Passthrough to dropdb CLI

## Usage Examples
- "dropdb --help"
- "dropdb self version"

## Installation
```bash
apt-get install dropdb 2>/dev/null || which dropdb
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
