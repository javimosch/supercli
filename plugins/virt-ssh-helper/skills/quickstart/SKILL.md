---
name: virt-ssh-helper
description: Use this skill when the user wants to use virt-ssh-helper, cli tool: virt-ssh-helper.
---

# virt-ssh-helper Plugin

CLI tool: virt-ssh-helper.

## Commands
- `virt-ssh-helper <resource> <action>` — Execute virt-ssh-helper commands
- `virt-ssh-helper self version` — Print virt-ssh-helper version
- `virt-ssh-helper _ _` — Passthrough to virt-ssh-helper CLI

## Usage Examples
- "virt-ssh-helper --help"
- "virt-ssh-helper self version"

## Installation
```bash
apt-get install virt-ssh-helper 2>/dev/null || which virt-ssh-helper
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
