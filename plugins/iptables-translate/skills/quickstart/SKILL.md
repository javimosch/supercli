---
name: iptables-translate
description: Use this skill when the user wants to use iptables-translate, cli tool: iptables-translate.
---

# iptables-translate Plugin

CLI tool: iptables-translate.

## Commands
- `iptables-translate <resource> <action>` — Execute iptables-translate commands
- `iptables-translate self version` — Print iptables-translate version
- `iptables-translate _ _` — Passthrough to iptables-translate CLI

## Usage Examples
- "iptables-translate --help"
- "iptables-translate self version"

## Installation
```bash
apt-get install iptables-translate 2>/dev/null || which iptables-translate
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
