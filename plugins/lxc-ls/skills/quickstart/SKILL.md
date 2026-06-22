---
name: lxc-ls
description: Use this skill when the user wants to use lxc-ls, cli tool: lxc-ls.
---

# lxc-ls Plugin

CLI tool: lxc-ls.

## Commands
- `lxc-ls <resource> <action>` — Execute lxc-ls commands
- `lxc-ls self version` — Print lxc-ls version
- `lxc-ls _ _` — Passthrough to lxc-ls CLI

## Usage Examples
- "lxc-ls --help"
- "lxc-ls self version"

## Installation
```bash
apt-get install lxc-ls 2>/dev/null || which lxc-ls
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
