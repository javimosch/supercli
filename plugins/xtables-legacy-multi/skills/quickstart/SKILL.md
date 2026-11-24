---
name: xtables-legacy-multi
description: Use this skill when the user wants to use xtables-legacy-multi, administration tools for packet filtering and NAT.
---

# xtables-legacy-multi Plugin

xtables-legacy-multi — administration tools for packet filtering and NAT.

## Commands
- `xtables-legacy-multi <resource> <action>` — Execute xtables-legacy-multi commands
- `xtables-legacy-multi self version` — Print xtables-legacy-multi version
- `xtables-legacy-multi _ _` — Passthrough to xtables-legacy-multi CLI

## Usage Examples
- "xtables-legacy-multi --help"
- "xtables-legacy-multi self version"

## Installation
```bash
apt-get install iptables 2>/dev/null || which xtables-legacy-multi
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
