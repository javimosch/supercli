---
name: wg-quick
description: Use this skill when the user wants to use wg-quick, cli tool: wg-quick.
---

# wg-quick Plugin

CLI tool: wg-quick.

## Commands
- `wg-quick <resource> <action>` — Execute wg-quick commands
- `wg-quick self version` — Print wg-quick version
- `wg-quick _ _` — Passthrough to wg-quick CLI

## Usage Examples
- "wg-quick --help"
- "wg-quick self version"

## Installation
```bash
apt-get install wg-quick 2>/dev/null || which wg-quick
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
