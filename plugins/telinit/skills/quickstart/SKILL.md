---
name: telinit
description: Use this skill when the user wants to use telinit, cli tool: telinit.
---

# telinit Plugin

CLI tool: telinit.

## Commands
- `telinit <resource> <action>` — Execute telinit commands
- `telinit self version` — Print telinit version
- `telinit _ _` — Passthrough to telinit CLI

## Usage Examples
- "telinit --help"
- "telinit self version"

## Installation
```bash
apt-get install telinit 2>/dev/null || which telinit
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
