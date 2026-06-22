---
name: halt
description: Use this skill when the user wants to use halt, cli tool: halt.
---

# halt Plugin

CLI tool: halt.

## Commands
- `halt <resource> <action>` — Execute halt commands
- `halt self version` — Print halt version
- `halt _ _` — Passthrough to halt CLI

## Usage Examples
- "halt --help"
- "halt self version"

## Installation
```bash
apt-get install halt 2>/dev/null || which halt
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
