---
name: lxc-checkconfig
description: Use this skill when the user wants to use lxc-checkconfig, cli tool: lxc-checkconfig.
---

# lxc-checkconfig Plugin

CLI tool: lxc-checkconfig.

## Commands
- `lxc-checkconfig <resource> <action>` — Execute lxc-checkconfig commands
- `lxc-checkconfig self version` — Print lxc-checkconfig version
- `lxc-checkconfig _ _` — Passthrough to lxc-checkconfig CLI

## Usage Examples
- "lxc-checkconfig --help"
- "lxc-checkconfig self version"

## Installation
```bash
apt-get install lxc-checkconfig 2>/dev/null || which lxc-checkconfig
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
