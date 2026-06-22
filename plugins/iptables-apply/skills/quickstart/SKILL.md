---
name: iptables-apply
description: Use this skill when the user wants to use iptables-apply, cli tool: iptables-apply.
---

# iptables-apply Plugin

CLI tool: iptables-apply.

## Commands
- `iptables-apply <resource> <action>` — Execute iptables-apply commands
- `iptables-apply self version` — Print iptables-apply version
- `iptables-apply _ _` — Passthrough to iptables-apply CLI

## Usage Examples
- "iptables-apply --help"
- "iptables-apply self version"

## Installation
```bash
apt-get install iptables-apply 2>/dev/null || which iptables-apply
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
