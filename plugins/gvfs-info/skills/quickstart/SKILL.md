---
name: gvfs-info
description: Use this skill when the user wants to use gvfs-info, cli tool: gvfs-info.
---

# gvfs-info Plugin

CLI tool: gvfs-info.

## Commands
- `gvfs-info <resource> <action>` — Execute gvfs-info commands
- `gvfs-info self version` — Print gvfs-info version
- `gvfs-info _ _` — Passthrough to gvfs-info CLI

## Usage Examples
- "gvfs-info --help"
- "gvfs-info self version"

## Installation
```bash
apt-get install gvfs-info 2>/dev/null || which gvfs-info
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
