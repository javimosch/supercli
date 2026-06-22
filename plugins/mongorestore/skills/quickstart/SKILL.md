---
name: mongorestore
description: Use this skill when the user wants to use mongorestore, cli tool: mongorestore.
---

# mongorestore Plugin

CLI tool: mongorestore.

## Commands
- `mongorestore <resource> <action>` — Execute mongorestore commands
- `mongorestore self version` — Print mongorestore version
- `mongorestore _ _` — Passthrough to mongorestore CLI

## Usage Examples
- "mongorestore --help"
- "mongorestore self version"

## Installation
```bash
apt-get install mongorestore 2>/dev/null || which mongorestore
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
