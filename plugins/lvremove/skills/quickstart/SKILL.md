---
name: lvremove
description: Use this skill when the user wants to use lvremove, cli tool: lvremove.
---

# lvremove Plugin

CLI tool: lvremove.

## Commands
- `lvremove <resource> <action>` — Execute lvremove commands
- `lvremove self version` — Print lvremove version
- `lvremove _ _` — Passthrough to lvremove CLI

## Usage Examples
- "lvremove --help"
- "lvremove self version"

## Installation
```bash
apt-get install lvremove 2>/dev/null || which lvremove
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
