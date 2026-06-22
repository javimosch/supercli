---
name: lxc-attach
description: Use this skill when the user wants to use lxc-attach, cli tool: lxc-attach.
---

# lxc-attach Plugin

CLI tool: lxc-attach.

## Commands
- `lxc-attach <resource> <action>` — Execute lxc-attach commands
- `lxc-attach self version` — Print lxc-attach version
- `lxc-attach _ _` — Passthrough to lxc-attach CLI

## Usage Examples
- "lxc-attach --help"
- "lxc-attach self version"

## Installation
```bash
apt-get install lxc-attach 2>/dev/null || which lxc-attach
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
