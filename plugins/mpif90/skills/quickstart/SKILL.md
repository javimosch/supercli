---
name: mpif90
description: Use this skill when the user wants to use mpif90, cli tool: mpif90.
---

# mpif90 Plugin

CLI tool: mpif90.

## Commands
- `mpif90 <resource> <action>` — Execute mpif90 commands
- `mpif90 self version` — Print mpif90 version
- `mpif90 _ _` — Passthrough to mpif90 CLI

## Usage Examples
- "mpif90 --help"
- "mpif90 self version"

## Installation
```bash
apt-get install mpif90 2>/dev/null || which mpif90
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
