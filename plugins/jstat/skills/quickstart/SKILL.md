---
name: jstat
description: Use this skill when the user wants to use jstat, cli tool: jstat.
---

# jstat Plugin

CLI tool: jstat.

## Commands
- `jstat <resource> <action>` — Execute jstat commands
- `jstat self version` — Print jstat version
- `jstat _ _` — Passthrough to jstat CLI

## Usage Examples
- "jstat --help"
- "jstat self version"

## Installation
```bash
apt-get install jstat 2>/dev/null || which jstat
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
