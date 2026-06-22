---
name: lxc-execute
description: Use this skill when the user wants to use lxc-execute, cli tool: lxc-execute.
---

# lxc-execute Plugin

CLI tool: lxc-execute.

## Commands
- `lxc-execute <resource> <action>` — Execute lxc-execute commands
- `lxc-execute self version` — Print lxc-execute version
- `lxc-execute _ _` — Passthrough to lxc-execute CLI

## Usage Examples
- "lxc-execute --help"
- "lxc-execute self version"

## Installation
```bash
apt-get install lxc-execute 2>/dev/null || which lxc-execute
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
