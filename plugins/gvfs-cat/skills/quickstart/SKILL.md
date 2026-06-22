---
name: gvfs-cat
description: Use this skill when the user wants to use gvfs-cat, cli tool: gvfs-cat.
---

# gvfs-cat Plugin

CLI tool: gvfs-cat.

## Commands
- `gvfs-cat <resource> <action>` — Execute gvfs-cat commands
- `gvfs-cat self version` — Print gvfs-cat version
- `gvfs-cat _ _` — Passthrough to gvfs-cat CLI

## Usage Examples
- "gvfs-cat --help"
- "gvfs-cat self version"

## Installation
```bash
apt-get install gvfs-cat 2>/dev/null || which gvfs-cat
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
