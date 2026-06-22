---
name: ModemManager
description: Use this skill when the user wants to use ModemManager, cli tool: modemmanager.
---

# ModemManager Plugin

CLI tool: ModemManager.

## Commands
- `ModemManager <resource> <action>` — Execute ModemManager commands
- `ModemManager self version` — Print ModemManager version
- `ModemManager _ _` — Passthrough to ModemManager CLI

## Usage Examples
- "ModemManager --help"
- "ModemManager self version"

## Installation
```bash
apt-get install ModemManager 2>/dev/null || which ModemManager
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
