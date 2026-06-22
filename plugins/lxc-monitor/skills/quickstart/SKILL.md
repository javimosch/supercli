---
name: lxc-monitor
description: Use this skill when the user wants to use lxc-monitor, cli tool: lxc-monitor.
---

# lxc-monitor Plugin

CLI tool: lxc-monitor.

## Commands
- `lxc-monitor <resource> <action>` — Execute lxc-monitor commands
- `lxc-monitor self version` — Print lxc-monitor version
- `lxc-monitor _ _` — Passthrough to lxc-monitor CLI

## Usage Examples
- "lxc-monitor --help"
- "lxc-monitor self version"

## Installation
```bash
apt-get install lxc-monitor 2>/dev/null || which lxc-monitor
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
