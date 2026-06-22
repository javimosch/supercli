---
name: lxc-usernsexec
description: Use this skill when the user wants to use lxc-usernsexec, cli tool: lxc-usernsexec.
---

# lxc-usernsexec Plugin

CLI tool: lxc-usernsexec.

## Commands
- `lxc-usernsexec <resource> <action>` — Execute lxc-usernsexec commands
- `lxc-usernsexec self version` — Print lxc-usernsexec version
- `lxc-usernsexec _ _` — Passthrough to lxc-usernsexec CLI

## Usage Examples
- "lxc-usernsexec --help"
- "lxc-usernsexec self version"

## Installation
```bash
apt-get install lxc-usernsexec 2>/dev/null || which lxc-usernsexec
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
