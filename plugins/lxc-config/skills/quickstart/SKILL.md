---
name: lxc-config
description: Use this skill when the user wants to use lxc-config, cli tool: lxc-config.
---

# lxc-config Plugin

CLI tool: lxc-config.

## Commands
- `lxc-config <resource> <action>` — Execute lxc-config commands
- `lxc-config self version` — Print lxc-config version
- `lxc-config _ _` — Passthrough to lxc-config CLI

## Usage Examples
- "lxc-config --help"
- "lxc-config self version"

## Installation
```bash
apt-get install lxc-config 2>/dev/null || which lxc-config
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
