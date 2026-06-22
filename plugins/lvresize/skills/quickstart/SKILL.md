---
name: lvresize
description: Use this skill when the user wants to use lvresize, cli tool: lvresize.
---

# lvresize Plugin

CLI tool: lvresize.

## Commands
- `lvresize <resource> <action>` — Execute lvresize commands
- `lvresize self version` — Print lvresize version
- `lvresize _ _` — Passthrough to lvresize CLI

## Usage Examples
- "lvresize --help"
- "lvresize self version"

## Installation
```bash
apt-get install lvresize 2>/dev/null || which lvresize
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
