---
name: gdisk
description: Use this skill when the user wants to use gdisk, cli tool: gdisk.
---

# gdisk Plugin

CLI tool: gdisk.

## Commands
- `gdisk <resource> <action>` — Execute gdisk commands
- `gdisk self version` — Print gdisk version
- `gdisk _ _` — Passthrough to gdisk CLI

## Usage Examples
- "gdisk --help"
- "gdisk self version"

## Installation
```bash
apt-get install gdisk 2>/dev/null || which gdisk
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
