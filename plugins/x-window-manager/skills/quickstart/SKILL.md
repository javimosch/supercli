---
name: x-window-manager
description: Use this skill when the user wants to use x-window-manager, Example window manager using GNOME's window manager library.
---

# x-window-manager Plugin

x-window-manager — Example window manager using GNOME's window manager library.

## Commands
- `x-window-manager <resource> <action>` — Execute x-window-manager commands
- `x-window-manager self version` — Print x-window-manager version
- `x-window-manager _ _` — Passthrough to x-window-manager CLI

## Usage Examples
- "x-window-manager --help"
- "x-window-manager self version"

## Installation
```bash
apt-get install mutter 2>/dev/null || which x-window-manager
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
