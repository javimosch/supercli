---
name: thin_restore
description: Use this skill when the user wants to use thin_restore, cli tool: thin_restore.
---

# thin_restore Plugin

CLI tool: thin_restore.

## Commands
- `thin_restore <resource> <action>` — Execute thin_restore commands
- `thin_restore self version` — Print thin_restore version
- `thin_restore _ _` — Passthrough to thin_restore CLI

## Usage Examples
- "thin_restore --help"
- "thin_restore self version"

## Installation
```bash
apt-get install thin_restore 2>/dev/null || which thin_restore
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
