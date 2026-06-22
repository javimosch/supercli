---
name: pppstats
description: Use this skill when the user wants to use pppstats, cli tool: pppstats.
---

# pppstats Plugin

CLI tool: pppstats.

## Commands
- `pppstats <resource> <action>` — Execute pppstats commands
- `pppstats self version` — Print pppstats version
- `pppstats _ _` — Passthrough to pppstats CLI

## Usage Examples
- "pppstats --help"
- "pppstats self version"

## Installation
```bash
apt-get install pppstats 2>/dev/null || which pppstats
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
