---
name: update-texmf
description: Use this skill when the user wants to use update-texmf, cli tool: update-texmf.
---

# update-texmf Plugin

CLI tool: update-texmf.

## Commands
- `update-texmf <resource> <action>` — Execute update-texmf commands
- `update-texmf self version` — Print update-texmf version
- `update-texmf _ _` — Passthrough to update-texmf CLI

## Usage Examples
- "update-texmf --help"
- "update-texmf self version"

## Installation
```bash
apt-get install update-texmf 2>/dev/null || which update-texmf
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
