---
name: vboxmanage
description: Use this skill when the user wants to use vboxmanage, cli tool: vboxmanage.
---

# vboxmanage Plugin

CLI tool: vboxmanage.

## Commands
- `vboxmanage <resource> <action>` — Execute vboxmanage commands
- `vboxmanage self version` — Print vboxmanage version
- `vboxmanage _ _` — Passthrough to vboxmanage CLI

## Usage Examples
- "vboxmanage --help"
- "vboxmanage self version"

## Installation
```bash
apt-get install vboxmanage 2>/dev/null || which vboxmanage
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
