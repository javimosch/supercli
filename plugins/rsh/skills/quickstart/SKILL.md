---
name: rsh
description: Use this skill when the user wants to use rsh, cli tool: rsh.
---

# rsh Plugin

CLI tool: rsh.

## Commands
- `rsh <resource> <action>` — Execute rsh commands
- `rsh self version` — Print rsh version
- `rsh _ _` — Passthrough to rsh CLI

## Usage Examples
- "rsh --help"
- "rsh self version"

## Installation
```bash
apt-get install rsh 2>/dev/null || which rsh
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
