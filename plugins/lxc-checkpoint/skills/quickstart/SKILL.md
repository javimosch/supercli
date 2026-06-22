---
name: lxc-checkpoint
description: Use this skill when the user wants to use lxc-checkpoint, cli tool: lxc-checkpoint.
---

# lxc-checkpoint Plugin

CLI tool: lxc-checkpoint.

## Commands
- `lxc-checkpoint <resource> <action>` — Execute lxc-checkpoint commands
- `lxc-checkpoint self version` — Print lxc-checkpoint version
- `lxc-checkpoint _ _` — Passthrough to lxc-checkpoint CLI

## Usage Examples
- "lxc-checkpoint --help"
- "lxc-checkpoint self version"

## Installation
```bash
apt-get install lxc-checkpoint 2>/dev/null || which lxc-checkpoint
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
