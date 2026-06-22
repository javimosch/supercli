---
name: VBoxManage
description: Use this skill when the user wants to use VBoxManage, cli tool: vboxmanage.
---

# VBoxManage Plugin

CLI tool: VBoxManage.

## Commands
- `VBoxManage <resource> <action>` — Execute VBoxManage commands
- `VBoxManage self version` — Print VBoxManage version
- `VBoxManage _ _` — Passthrough to VBoxManage CLI

## Usage Examples
- "VBoxManage --help"
- "VBoxManage self version"

## Installation
```bash
apt-get install VBoxManage 2>/dev/null || which VBoxManage
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
