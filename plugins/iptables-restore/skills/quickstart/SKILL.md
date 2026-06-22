---
name: iptables-restore
description: Use this skill when the user wants to use iptables-restore, cli tool: iptables-restore.
---

# iptables-restore Plugin

CLI tool: iptables-restore.

## Commands
- `iptables-restore <resource> <action>` — Execute iptables-restore commands
- `iptables-restore self version` — Print iptables-restore version
- `iptables-restore _ _` — Passthrough to iptables-restore CLI

## Usage Examples
- "iptables-restore --help"
- "iptables-restore self version"

## Installation
```bash
apt-get install iptables-restore 2>/dev/null || which iptables-restore
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
