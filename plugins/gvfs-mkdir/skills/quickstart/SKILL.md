---
name: gvfs-mkdir
description: Use this skill when the user wants to use gvfs-mkdir, cli tool: gvfs-mkdir.
---

# gvfs-mkdir Plugin

CLI tool: gvfs-mkdir.

## Commands
- `gvfs-mkdir <resource> <action>` — Execute gvfs-mkdir commands
- `gvfs-mkdir self version` — Print gvfs-mkdir version
- `gvfs-mkdir _ _` — Passthrough to gvfs-mkdir CLI

## Usage Examples
- "gvfs-mkdir --help"
- "gvfs-mkdir self version"

## Installation
```bash
apt-get install gvfs-mkdir 2>/dev/null || which gvfs-mkdir
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
