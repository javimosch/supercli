---
name: ModemManager
description: Use this skill when the user wants to use ModemManager, D-Bus service for managing modems.
---

# ModemManager Plugin

ModemManager — D-Bus service for managing modems.

## Commands
- `ModemManager <resource> <action>` — Execute ModemManager commands
- `ModemManager self version` — Print ModemManager version
- `ModemManager _ _` — Passthrough to ModemManager CLI

## Usage Examples
- "ModemManager --help"
- "ModemManager self version"

## Installation
```bash
apt-get install modemmanager 2>/dev/null || which ModemManager
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
