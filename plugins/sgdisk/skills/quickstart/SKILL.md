---
name: sgdisk
description: Use this skill when the user wants to use sgdisk, cli tool: sgdisk.
---

# sgdisk Plugin

CLI tool: sgdisk.

## Commands
- `sgdisk <resource> <action>` — Execute sgdisk commands
- `sgdisk self version` — Print sgdisk version
- `sgdisk _ _` — Passthrough to sgdisk CLI

## Usage Examples
- "sgdisk --help"
- "sgdisk self version"

## Installation
```bash
apt-get install sgdisk 2>/dev/null || which sgdisk
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
