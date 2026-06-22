---
name: update-manager
description: Use this skill when the user wants to use update-manager, cli tool: update-manager.
---

# update-manager Plugin

CLI tool: update-manager.

## Commands
- `update-manager <resource> <action>` — Execute update-manager commands
- `update-manager self version` — Print update-manager version
- `update-manager _ _` — Passthrough to update-manager CLI

## Usage Examples
- "update-manager --help"
- "update-manager self version"

## Installation
```bash
apt-get install update-manager 2>/dev/null || which update-manager
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
