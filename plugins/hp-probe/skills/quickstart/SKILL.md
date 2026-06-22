---
name: hp-probe
description: Use this skill when the user wants to use hp-probe, cli tool: hp-probe.
---

# hp-probe Plugin

CLI tool: hp-probe.

## Commands
- `hp-probe <resource> <action>` — Execute hp-probe commands
- `hp-probe self version` — Print hp-probe version
- `hp-probe _ _` — Passthrough to hp-probe CLI

## Usage Examples
- "hp-probe --help"
- "hp-probe self version"

## Installation
```bash
apt-get install hp-probe 2>/dev/null || which hp-probe
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
