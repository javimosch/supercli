---
name: gvfs-ls
description: Use this skill when the user wants to use gvfs-ls, cli tool: gvfs-ls.
---

# gvfs-ls Plugin

CLI tool: gvfs-ls.

## Commands
- `gvfs-ls <resource> <action>` — Execute gvfs-ls commands
- `gvfs-ls self version` — Print gvfs-ls version
- `gvfs-ls _ _` — Passthrough to gvfs-ls CLI

## Usage Examples
- "gvfs-ls --help"
- "gvfs-ls self version"

## Installation
```bash
apt-get install gvfs-ls 2>/dev/null || which gvfs-ls
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
