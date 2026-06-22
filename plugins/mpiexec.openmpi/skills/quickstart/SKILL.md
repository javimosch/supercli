---
name: mpiexec.openmpi
description: Use this skill when the user wants to use mpiexec.openmpi, cli tool: mpiexec.openmpi.
---

# mpiexec.openmpi Plugin

CLI tool: mpiexec.openmpi.

## Commands
- `mpiexec.openmpi <resource> <action>` — Execute mpiexec.openmpi commands
- `mpiexec.openmpi self version` — Print mpiexec.openmpi version
- `mpiexec.openmpi _ _` — Passthrough to mpiexec.openmpi CLI

## Usage Examples
- "mpiexec.openmpi --help"
- "mpiexec.openmpi self version"

## Installation
```bash
apt-get install mpiexec.openmpi 2>/dev/null || which mpiexec.openmpi
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
