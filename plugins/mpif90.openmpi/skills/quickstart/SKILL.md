---
name: mpif90.openmpi
description: Use this skill when the user wants to use mpif90.openmpi, cli tool: mpif90.openmpi.
---

# mpif90.openmpi Plugin

CLI tool: mpif90.openmpi.

## Commands
- `mpif90.openmpi <resource> <action>` — Execute mpif90.openmpi commands
- `mpif90.openmpi self version` — Print mpif90.openmpi version
- `mpif90.openmpi _ _` — Passthrough to mpif90.openmpi CLI

## Usage Examples
- "mpif90.openmpi --help"
- "mpif90.openmpi self version"

## Installation
```bash
apt-get install mpif90.openmpi 2>/dev/null || which mpif90.openmpi
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
