---
name: gvfs-trash
description: Use this skill when the user wants to use gvfs-trash, cli tool: gvfs-trash.
---

# gvfs-trash Plugin

CLI tool: gvfs-trash.

## Commands
- `gvfs-trash <resource> <action>` — Execute gvfs-trash commands
- `gvfs-trash self version` — Print gvfs-trash version
- `gvfs-trash _ _` — Passthrough to gvfs-trash CLI

## Usage Examples
- "gvfs-trash --help"
- "gvfs-trash self version"

## Installation
```bash
apt-get install gvfs-trash 2>/dev/null || which gvfs-trash
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
