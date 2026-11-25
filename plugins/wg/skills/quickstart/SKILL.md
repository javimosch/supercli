---
name: wg
description: Use this skill when the user wants to use wg, fast, modern, secure kernel VPN tunnel (userland utilities).
---

# wg Plugin

wg — fast, modern, secure kernel VPN tunnel (userland utilities).

## Commands
- `wg <resource> <action>` — Execute wg commands
- `wg self version` — Print wg version
- `wg _ _` — Passthrough to wg CLI

## Usage Examples
- "wg --help"
- "wg self version"

## Installation
```bash
apt-get install wireguard-tools 2>/dev/null || which wg
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
