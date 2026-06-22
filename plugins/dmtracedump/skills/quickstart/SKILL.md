---
name: dmtracedump
description: Use this skill when the user wants to use dmtracedump, cli tool: dmtracedump.
---

# dmtracedump Plugin

CLI tool: dmtracedump.

## Commands
- `dmtracedump <resource> <action>` — Execute dmtracedump commands
- `dmtracedump self version` — Print dmtracedump version
- `dmtracedump _ _` — Passthrough to dmtracedump CLI

## Usage Examples
- "dmtracedump --help"
- "dmtracedump self version"

## Installation
```bash
apt-get install dmtracedump 2>/dev/null || which dmtracedump
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
