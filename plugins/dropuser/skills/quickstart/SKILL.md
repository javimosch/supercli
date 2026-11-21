---
name: dropuser
description: Use this skill when the user wants to use dropuser, manager for multiple PostgreSQL client versions.
---

# dropuser Plugin

dropuser — manager for multiple PostgreSQL client versions.

## Commands
- `dropuser <resource> <action>` — Execute dropuser commands
- `dropuser self version` — Print dropuser version
- `dropuser _ _` — Passthrough to dropuser CLI

## Usage Examples
- "dropuser --help"
- "dropuser self version"

## Installation
```bash
apt-get install postgresql-client-common 2>/dev/null || which dropuser
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
