---
name: pactl
description: Use this skill when the user wants to use pactl, cli tool: pactl.
---

# pactl Plugin

CLI tool: pactl.

## Commands
- `pactl <resource> <action>` — Execute pactl commands
- `pactl self version` — Print pactl version
- `pactl _ _` — Passthrough to pactl CLI

## Usage Examples
- "pactl --help"
- "pactl self version"

## Installation
```bash
apt-get install pactl 2>/dev/null || which pactl
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
