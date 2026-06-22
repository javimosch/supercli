---
name: loadkeys
description: Use this skill when the user wants to use loadkeys, cli tool: loadkeys.
---

# loadkeys Plugin

CLI tool: loadkeys.

## Commands
- `loadkeys <resource> <action>` — Execute loadkeys commands
- `loadkeys self version` — Print loadkeys version
- `loadkeys _ _` — Passthrough to loadkeys CLI

## Usage Examples
- "loadkeys --help"
- "loadkeys self version"

## Installation
```bash
apt-get install loadkeys 2>/dev/null || which loadkeys
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
