---
name: lxc-freeze
description: Use this skill when the user wants to use lxc-freeze, cli tool: lxc-freeze.
---

# lxc-freeze Plugin

CLI tool: lxc-freeze.

## Commands
- `lxc-freeze <resource> <action>` — Execute lxc-freeze commands
- `lxc-freeze self version` — Print lxc-freeze version
- `lxc-freeze _ _` — Passthrough to lxc-freeze CLI

## Usage Examples
- "lxc-freeze --help"
- "lxc-freeze self version"

## Installation
```bash
apt-get install lxc-freeze 2>/dev/null || which lxc-freeze
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
