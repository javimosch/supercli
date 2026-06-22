---
name: kpsestat
description: Use this skill when the user wants to use kpsestat, cli tool: kpsestat.
---

# kpsestat Plugin

CLI tool: kpsestat.

## Commands
- `kpsestat <resource> <action>` — Execute kpsestat commands
- `kpsestat self version` — Print kpsestat version
- `kpsestat _ _` — Passthrough to kpsestat CLI

## Usage Examples
- "kpsestat --help"
- "kpsestat self version"

## Installation
```bash
apt-get install kpsestat 2>/dev/null || which kpsestat
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
