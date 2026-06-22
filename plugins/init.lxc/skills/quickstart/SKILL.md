---
name: init.lxc
description: Use this skill when the user wants to use init.lxc, cli tool: init.lxc.
---

# init.lxc Plugin

CLI tool: init.lxc.

## Commands
- `init.lxc <resource> <action>` — Execute init.lxc commands
- `init.lxc self version` — Print init.lxc version
- `init.lxc _ _` — Passthrough to init.lxc CLI

## Usage Examples
- "init.lxc --help"
- "init.lxc self version"

## Installation
```bash
apt-get install init.lxc 2>/dev/null || which init.lxc
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
