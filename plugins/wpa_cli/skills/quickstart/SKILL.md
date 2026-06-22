---
name: wpa_cli
description: Use this skill when the user wants to use wpa_cli, cli tool: wpa_cli.
---

# wpa_cli Plugin

CLI tool: wpa_cli.

## Commands
- `wpa_cli <resource> <action>` — Execute wpa_cli commands
- `wpa_cli self version` — Print wpa_cli version
- `wpa_cli _ _` — Passthrough to wpa_cli CLI

## Usage Examples
- "wpa_cli --help"
- "wpa_cli self version"

## Installation
```bash
apt-get install wpa_cli 2>/dev/null || which wpa_cli
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
