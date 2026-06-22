---
name: ubuntu-drivers
description: Use this skill when the user wants to use ubuntu-drivers, cli tool: ubuntu-drivers.
---

# ubuntu-drivers Plugin

CLI tool: ubuntu-drivers.

## Commands
- `ubuntu-drivers <resource> <action>` — Execute ubuntu-drivers commands
- `ubuntu-drivers self version` — Print ubuntu-drivers version
- `ubuntu-drivers _ _` — Passthrough to ubuntu-drivers CLI

## Usage Examples
- "ubuntu-drivers --help"
- "ubuntu-drivers self version"

## Installation
```bash
apt-get install ubuntu-drivers 2>/dev/null || which ubuntu-drivers
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
