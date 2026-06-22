---
name: localectl
description: Use this skill when the user wants to use localectl, cli tool: localectl.
---

# localectl Plugin

CLI tool: localectl.

## Commands
- `localectl <resource> <action>` — Execute localectl commands
- `localectl self version` — Print localectl version
- `localectl _ _` — Passthrough to localectl CLI

## Usage Examples
- "localectl --help"
- "localectl self version"

## Installation
```bash
apt-get install localectl 2>/dev/null || which localectl
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
