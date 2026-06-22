---
name: iptables-save
description: Use this skill when the user wants to use iptables-save, cli tool: iptables-save.
---

# iptables-save Plugin

CLI tool: iptables-save.

## Commands
- `iptables-save <resource> <action>` — Execute iptables-save commands
- `iptables-save self version` — Print iptables-save version
- `iptables-save _ _` — Passthrough to iptables-save CLI

## Usage Examples
- "iptables-save --help"
- "iptables-save self version"

## Installation
```bash
apt-get install iptables-save 2>/dev/null || which iptables-save
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
