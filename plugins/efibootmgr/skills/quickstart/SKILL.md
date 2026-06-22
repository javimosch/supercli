---
name: efibootmgr
description: Use this skill when the user wants to use efibootmgr, cli tool: efibootmgr.
---

# efibootmgr Plugin

CLI tool: efibootmgr.

## Commands
- `efibootmgr <resource> <action>` — Execute efibootmgr commands
- `efibootmgr self version` — Print efibootmgr version
- `efibootmgr _ _` — Passthrough to efibootmgr CLI

## Usage Examples
- "efibootmgr --help"
- "efibootmgr self version"

## Installation
```bash
apt-get install efibootmgr 2>/dev/null || which efibootmgr
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
