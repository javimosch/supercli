---
name: wg-quick
description: Use this skill when the user wants to use wg-quick, fast, modern, secure kernel VPN tunnel (userland utilities).
---

# wg-quick Plugin

wg-quick — fast, modern, secure kernel VPN tunnel (userland utilities).

## Commands
- `wg-quick <resource> <action>` — Execute wg-quick commands
- `wg-quick self version` — Print wg-quick version
- `wg-quick _ _` — Passthrough to wg-quick CLI

## Usage Examples
- "wg-quick --help"
- "wg-quick self version"

## Installation
```bash
apt-get install wireguard-tools 2>/dev/null || which wg-quick
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
