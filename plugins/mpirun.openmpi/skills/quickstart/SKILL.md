---
name: mpirun.openmpi
description: Use this skill when the user wants to use mpirun.openmpi, cli tool: mpirun.openmpi.
---

# mpirun.openmpi Plugin

CLI tool: mpirun.openmpi.

## Commands
- `mpirun.openmpi <resource> <action>` — Execute mpirun.openmpi commands
- `mpirun.openmpi self version` — Print mpirun.openmpi version
- `mpirun.openmpi _ _` — Passthrough to mpirun.openmpi CLI

## Usage Examples
- "mpirun.openmpi --help"
- "mpirun.openmpi self version"

## Installation
```bash
apt-get install mpirun.openmpi 2>/dev/null || which mpirun.openmpi
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
