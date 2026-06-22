---
name: ibus-setup
description: Use this skill when the user wants to use ibus-setup, cli tool: ibus-setup.
---

# ibus-setup Plugin

CLI tool: ibus-setup.

## Commands
- `ibus-setup <resource> <action>` — Execute ibus-setup commands
- `ibus-setup self version` — Print ibus-setup version
- `ibus-setup _ _` — Passthrough to ibus-setup CLI

## Usage Examples
- "ibus-setup --help"
- "ibus-setup self version"

## Installation
```bash
apt-get install ibus-setup 2>/dev/null || which ibus-setup
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
