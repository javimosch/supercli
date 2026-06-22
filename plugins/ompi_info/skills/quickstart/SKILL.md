---
name: ompi_info
description: Use this skill when the user wants to use ompi_info, cli tool: ompi_info.
---

# ompi_info Plugin

CLI tool: ompi_info.

## Commands
- `ompi_info <resource> <action>` — Execute ompi_info commands
- `ompi_info self version` — Print ompi_info version
- `ompi_info _ _` — Passthrough to ompi_info CLI

## Usage Examples
- "ompi_info --help"
- "ompi_info self version"

## Installation
```bash
apt-get install ompi_info 2>/dev/null || which ompi_info
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
