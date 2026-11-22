---
name: droplang
description: Use this skill when the user wants to use droplang, manager for multiple PostgreSQL client versions.
---

# droplang Plugin

droplang — manager for multiple PostgreSQL client versions.

## Commands
- `droplang <resource> <action>` — Execute droplang commands
- `droplang self version` — Print droplang version
- `droplang _ _` — Passthrough to droplang CLI

## Usage Examples
- "droplang --help"
- "droplang self version"

## Installation
```bash
apt-get install postgresql-client-common 2>/dev/null || which droplang
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
