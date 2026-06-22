---
name: hp-scan
description: Use this skill when the user wants to use hp-scan, cli tool: hp-scan.
---

# hp-scan Plugin

CLI tool: hp-scan.

## Commands
- `hp-scan <resource> <action>` — Execute hp-scan commands
- `hp-scan self version` — Print hp-scan version
- `hp-scan _ _` — Passthrough to hp-scan CLI

## Usage Examples
- "hp-scan --help"
- "hp-scan self version"

## Installation
```bash
apt-get install hp-scan 2>/dev/null || which hp-scan
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
