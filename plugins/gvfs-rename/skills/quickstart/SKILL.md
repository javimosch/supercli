---
name: gvfs-rename
description: Use this skill when the user wants to use gvfs-rename, cli tool: gvfs-rename.
---

# gvfs-rename Plugin

CLI tool: gvfs-rename.

## Commands
- `gvfs-rename <resource> <action>` — Execute gvfs-rename commands
- `gvfs-rename self version` — Print gvfs-rename version
- `gvfs-rename _ _` — Passthrough to gvfs-rename CLI

## Usage Examples
- "gvfs-rename --help"
- "gvfs-rename self version"

## Installation
```bash
apt-get install gvfs-rename 2>/dev/null || which gvfs-rename
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
