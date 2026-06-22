---
name: mpiexec
description: Use this skill when the user wants to use mpiexec, cli tool: mpiexec.
---

# mpiexec Plugin

CLI tool: mpiexec.

## Commands
- `mpiexec <resource> <action>` — Execute mpiexec commands
- `mpiexec self version` — Print mpiexec version
- `mpiexec _ _` — Passthrough to mpiexec CLI

## Usage Examples
- "mpiexec --help"
- "mpiexec self version"

## Installation
```bash
apt-get install mpiexec 2>/dev/null || which mpiexec
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
