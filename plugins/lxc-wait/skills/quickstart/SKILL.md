---
name: lxc-wait
description: Use this skill when the user wants to use lxc-wait, cli tool: lxc-wait.
---

# lxc-wait Plugin

CLI tool: lxc-wait.

## Commands
- `lxc-wait <resource> <action>` — Execute lxc-wait commands
- `lxc-wait self version` — Print lxc-wait version
- `lxc-wait _ _` — Passthrough to lxc-wait CLI

## Usage Examples
- "lxc-wait --help"
- "lxc-wait self version"

## Installation
```bash
apt-get install lxc-wait 2>/dev/null || which lxc-wait
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
