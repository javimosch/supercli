---
name: mpiCC.openmpi
description: Use this skill when the user wants to use mpiCC.openmpi, cli tool: mpicc.openmpi.
---

# mpiCC.openmpi Plugin

CLI tool: mpiCC.openmpi.

## Commands
- `mpiCC.openmpi <resource> <action>` — Execute mpiCC.openmpi commands
- `mpiCC.openmpi self version` — Print mpiCC.openmpi version
- `mpiCC.openmpi _ _` — Passthrough to mpiCC.openmpi CLI

## Usage Examples
- "mpiCC.openmpi --help"
- "mpiCC.openmpi self version"

## Installation
```bash
apt-get install mpiCC.openmpi 2>/dev/null || which mpiCC.openmpi
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
