---
name: lxc-info
description: Use this skill when the user wants to use lxc-info, cli tool: lxc-info.
---

# lxc-info Plugin

CLI tool: lxc-info.

## Commands
- `lxc-info <resource> <action>` — Execute lxc-info commands
- `lxc-info self version` — Print lxc-info version
- `lxc-info _ _` — Passthrough to lxc-info CLI

## Usage Examples
- "lxc-info --help"
- "lxc-info self version"

## Installation
```bash
apt-get install lxc-info 2>/dev/null || which lxc-info
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
