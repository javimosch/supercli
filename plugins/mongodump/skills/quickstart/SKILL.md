---
name: mongodump
description: Use this skill when the user wants to use mongodump, cli tool: mongodump.
---

# mongodump Plugin

CLI tool: mongodump.

## Commands
- `mongodump <resource> <action>` — Execute mongodump commands
- `mongodump self version` — Print mongodump version
- `mongodump _ _` — Passthrough to mongodump CLI

## Usage Examples
- "mongodump --help"
- "mongodump self version"

## Installation
```bash
apt-get install mongodump 2>/dev/null || which mongodump
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
