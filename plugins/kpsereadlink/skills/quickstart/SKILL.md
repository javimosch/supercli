---
name: kpsereadlink
description: Use this skill when the user wants to use kpsereadlink, cli tool: kpsereadlink.
---

# kpsereadlink Plugin

CLI tool: kpsereadlink.

## Commands
- `kpsereadlink <resource> <action>` — Execute kpsereadlink commands
- `kpsereadlink self version` — Print kpsereadlink version
- `kpsereadlink _ _` — Passthrough to kpsereadlink CLI

## Usage Examples
- "kpsereadlink --help"
- "kpsereadlink self version"

## Installation
```bash
apt-get install kpsereadlink 2>/dev/null || which kpsereadlink
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
