---
name: vboxwebsrv
description: Use this skill when the user wants to use vboxwebsrv, cli tool: vboxwebsrv.
---

# vboxwebsrv Plugin

CLI tool: vboxwebsrv.

## Commands
- `vboxwebsrv <resource> <action>` — Execute vboxwebsrv commands
- `vboxwebsrv self version` — Print vboxwebsrv version
- `vboxwebsrv _ _` — Passthrough to vboxwebsrv CLI

## Usage Examples
- "vboxwebsrv --help"
- "vboxwebsrv self version"

## Installation
```bash
apt-get install vboxwebsrv 2>/dev/null || which vboxwebsrv
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
