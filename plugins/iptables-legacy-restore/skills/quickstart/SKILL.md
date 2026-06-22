---
name: iptables-legacy-restore
description: Use this skill when the user wants to use iptables-legacy-restore, cli tool: iptables-legacy-restore.
---

# iptables-legacy-restore Plugin

CLI tool: iptables-legacy-restore.

## Commands
- `iptables-legacy-restore <resource> <action>` — Execute iptables-legacy-restore commands
- `iptables-legacy-restore self version` — Print iptables-legacy-restore version
- `iptables-legacy-restore _ _` — Passthrough to iptables-legacy-restore CLI

## Usage Examples
- "iptables-legacy-restore --help"
- "iptables-legacy-restore self version"

## Installation
```bash
apt-get install iptables-legacy-restore 2>/dev/null || which iptables-legacy-restore
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
