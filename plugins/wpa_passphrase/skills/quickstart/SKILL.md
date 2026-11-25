---
name: wpa_passphrase
description: Use this skill when the user wants to use wpa_passphrase, client support for WPA and WPA2 (IEEE 802.11i).
---

# wpa_passphrase Plugin

wpa_passphrase — client support for WPA and WPA2 (IEEE 802.11i).

## Commands
- `wpa_passphrase <resource> <action>` — Execute wpa_passphrase commands
- `wpa_passphrase self version` — Print wpa_passphrase version
- `wpa_passphrase _ _` — Passthrough to wpa_passphrase CLI

## Usage Examples
- "wpa_passphrase --help"
- "wpa_passphrase self version"

## Installation
```bash
apt-get install wpasupplicant 2>/dev/null || which wpa_passphrase
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
