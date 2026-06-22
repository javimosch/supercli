---
name: lxc-autostart
description: Use this skill when the user wants to use lxc-autostart, cli tool: lxc-autostart.
---

# lxc-autostart Plugin

CLI tool: lxc-autostart.

## Commands
- `lxc-autostart <resource> <action>` — Execute lxc-autostart commands
- `lxc-autostart self version` — Print lxc-autostart version
- `lxc-autostart _ _` — Passthrough to lxc-autostart CLI

## Usage Examples
- "lxc-autostart --help"
- "lxc-autostart self version"

## Installation
```bash
apt-get install lxc-autostart 2>/dev/null || which lxc-autostart
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
