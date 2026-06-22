---
name: thin_repair
description: Use this skill when the user wants to use thin_repair, cli tool: thin_repair.
---

# thin_repair Plugin

CLI tool: thin_repair.

## Commands
- `thin_repair <resource> <action>` — Execute thin_repair commands
- `thin_repair self version` — Print thin_repair version
- `thin_repair _ _` — Passthrough to thin_repair CLI

## Usage Examples
- "thin_repair --help"
- "thin_repair self version"

## Installation
```bash
apt-get install thin_repair 2>/dev/null || which thin_repair
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
