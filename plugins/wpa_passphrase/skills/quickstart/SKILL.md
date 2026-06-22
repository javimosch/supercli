---
name: wpa_passphrase
description: Use this skill when the user wants to use wpa_passphrase, cli tool: wpa_passphrase.
---

# wpa_passphrase Plugin

CLI tool: wpa_passphrase.

## Commands
- `wpa_passphrase <resource> <action>` — Execute wpa_passphrase commands
- `wpa_passphrase self version` — Print wpa_passphrase version
- `wpa_passphrase _ _` — Passthrough to wpa_passphrase CLI

## Usage Examples
- "wpa_passphrase --help"
- "wpa_passphrase self version"

## Installation
```bash
apt-get install wpa_passphrase 2>/dev/null || which wpa_passphrase
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
