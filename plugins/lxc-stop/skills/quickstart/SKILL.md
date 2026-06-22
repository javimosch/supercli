---
name: lxc-stop
description: Use this skill when the user wants to use lxc-stop, cli tool: lxc-stop.
---

# lxc-stop Plugin

CLI tool: lxc-stop.

## Commands
- `lxc-stop <resource> <action>` — Execute lxc-stop commands
- `lxc-stop self version` — Print lxc-stop version
- `lxc-stop _ _` — Passthrough to lxc-stop CLI

## Usage Examples
- "lxc-stop --help"
- "lxc-stop self version"

## Installation
```bash
apt-get install lxc-stop 2>/dev/null || which lxc-stop
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
