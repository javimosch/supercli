---
name: kpsewhich
description: Use this skill when the user wants to use kpsewhich, cli tool: kpsewhich.
---

# kpsewhich Plugin

CLI tool: kpsewhich.

## Commands
- `kpsewhich <resource> <action>` — Execute kpsewhich commands
- `kpsewhich self version` — Print kpsewhich version
- `kpsewhich _ _` — Passthrough to kpsewhich CLI

## Usage Examples
- "kpsewhich --help"
- "kpsewhich self version"

## Installation
```bash
apt-get install kpsewhich 2>/dev/null || which kpsewhich
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
