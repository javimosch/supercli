---
name: gpu-manager
description: Use this skill when the user wants to use gpu-manager, cli tool: gpu-manager.
---

# gpu-manager Plugin

CLI tool: gpu-manager.

## Commands
- `gpu-manager <resource> <action>` — Execute gpu-manager commands
- `gpu-manager self version` — Print gpu-manager version
- `gpu-manager _ _` — Passthrough to gpu-manager CLI

## Usage Examples
- "gpu-manager --help"
- "gpu-manager self version"

## Installation
```bash
apt-get install gpu-manager 2>/dev/null || which gpu-manager
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
