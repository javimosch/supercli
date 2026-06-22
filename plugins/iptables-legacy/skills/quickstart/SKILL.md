---
name: iptables-legacy
description: Use this skill when the user wants to use iptables-legacy, cli tool: iptables-legacy.
---

# iptables-legacy Plugin

CLI tool: iptables-legacy.

## Commands
- `iptables-legacy <resource> <action>` — Execute iptables-legacy commands
- `iptables-legacy self version` — Print iptables-legacy version
- `iptables-legacy _ _` — Passthrough to iptables-legacy CLI

## Usage Examples
- "iptables-legacy --help"
- "iptables-legacy self version"

## Installation
```bash
apt-get install iptables-legacy 2>/dev/null || which iptables-legacy
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
