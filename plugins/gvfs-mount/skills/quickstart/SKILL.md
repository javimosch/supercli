---
name: gvfs-mount
description: Use this skill when the user wants to use gvfs-mount, cli tool: gvfs-mount.
---

# gvfs-mount Plugin

CLI tool: gvfs-mount.

## Commands
- `gvfs-mount <resource> <action>` — Execute gvfs-mount commands
- `gvfs-mount self version` — Print gvfs-mount version
- `gvfs-mount _ _` — Passthrough to gvfs-mount CLI

## Usage Examples
- "gvfs-mount --help"
- "gvfs-mount self version"

## Installation
```bash
apt-get install gvfs-mount 2>/dev/null || which gvfs-mount
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
