---
name: mongoexport
description: Use this skill when the user wants to use mongoexport, cli tool: mongoexport.
---

# mongoexport Plugin

CLI tool: mongoexport.

## Commands
- `mongoexport <resource> <action>` — Execute mongoexport commands
- `mongoexport self version` — Print mongoexport version
- `mongoexport _ _` — Passthrough to mongoexport CLI

## Usage Examples
- "mongoexport --help"
- "mongoexport self version"

## Installation
```bash
apt-get install mongoexport 2>/dev/null || which mongoexport
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
