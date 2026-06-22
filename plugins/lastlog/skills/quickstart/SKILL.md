---
name: lastlog
description: Use this skill when the user wants to use lastlog, cli tool: lastlog.
---

# lastlog Plugin

CLI tool: lastlog.

## Commands
- `lastlog <resource> <action>` — Execute lastlog commands
- `lastlog self version` — Print lastlog version
- `lastlog _ _` — Passthrough to lastlog CLI

## Usage Examples
- "lastlog --help"
- "lastlog self version"

## Installation
```bash
apt-get install lastlog 2>/dev/null || which lastlog
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
