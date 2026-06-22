---
name: iptables-legacy-save
description: Use this skill when the user wants to use iptables-legacy-save, cli tool: iptables-legacy-save.
---

# iptables-legacy-save Plugin

CLI tool: iptables-legacy-save.

## Commands
- `iptables-legacy-save <resource> <action>` — Execute iptables-legacy-save commands
- `iptables-legacy-save self version` — Print iptables-legacy-save version
- `iptables-legacy-save _ _` — Passthrough to iptables-legacy-save CLI

## Usage Examples
- "iptables-legacy-save --help"
- "iptables-legacy-save self version"

## Installation
```bash
apt-get install iptables-legacy-save 2>/dev/null || which iptables-legacy-save
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
