---
name: sensors-detect
description: Use this skill when the user wants to use sensors-detect, cli tool: sensors-detect.
---

# sensors-detect Plugin

CLI tool: sensors-detect.

## Commands
- `sensors-detect <resource> <action>` — Execute sensors-detect commands
- `sensors-detect self version` — Print sensors-detect version
- `sensors-detect _ _` — Passthrough to sensors-detect CLI

## Usage Examples
- "sensors-detect --help"
- "sensors-detect self version"

## Installation
```bash
apt-get install sensors-detect 2>/dev/null || which sensors-detect
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
