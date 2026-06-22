---
name: cups.lpstat
description: Use this skill when the user wants to use cups.lpstat, cli tool: cups.lpstat.
---

# cups.lpstat Plugin

CLI tool: cups.lpstat.

## Commands
- `cups.lpstat <resource> <action>` — Execute cups.lpstat commands
- `cups.lpstat self version` — Print cups.lpstat version
- `cups.lpstat _ _` — Passthrough to cups.lpstat CLI

## Usage Examples
- "cups.lpstat --help"
- "cups.lpstat self version"

## Installation
```bash
apt-get install cups.lpstat 2>/dev/null || which cups.lpstat
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
