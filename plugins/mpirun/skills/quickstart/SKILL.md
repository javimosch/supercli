---
name: mpirun
description: Use this skill when the user wants to use mpirun, cli tool: mpirun.
---

# mpirun Plugin

CLI tool: mpirun.

## Commands
- `mpirun <resource> <action>` — Execute mpirun commands
- `mpirun self version` — Print mpirun version
- `mpirun _ _` — Passthrough to mpirun CLI

## Usage Examples
- "mpirun --help"
- "mpirun self version"

## Installation
```bash
apt-get install mpirun 2>/dev/null || which mpirun
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
