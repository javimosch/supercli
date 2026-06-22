---
name: efibootdump
description: Use this skill when the user wants to use efibootdump, cli tool: efibootdump.
---

# efibootdump Plugin

CLI tool: efibootdump.

## Commands
- `efibootdump <resource> <action>` — Execute efibootdump commands
- `efibootdump self version` — Print efibootdump version
- `efibootdump _ _` — Passthrough to efibootdump CLI

## Usage Examples
- "efibootdump --help"
- "efibootdump self version"

## Installation
```bash
apt-get install efibootdump 2>/dev/null || which efibootdump
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
