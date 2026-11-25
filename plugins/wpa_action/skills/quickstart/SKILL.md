---
name: wpa_action
description: Use this skill when the user wants to use wpa_action, client support for WPA and WPA2 (IEEE 802.11i).
---

# wpa_action Plugin

wpa_action — client support for WPA and WPA2 (IEEE 802.11i).

## Commands
- `wpa_action <resource> <action>` — Execute wpa_action commands
- `wpa_action self version` — Print wpa_action version
- `wpa_action _ _` — Passthrough to wpa_action CLI

## Usage Examples
- "wpa_action --help"
- "wpa_action self version"

## Installation
```bash
apt-get install wpasupplicant 2>/dev/null || which wpa_action
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
