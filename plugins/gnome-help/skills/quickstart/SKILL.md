---
name: gnome-help
description: Use this skill when the user wants to use gnome-help, cli tool: gnome-help.
---

# gnome-help Plugin

CLI tool: gnome-help.

## Commands
- `gnome-help <resource> <action>` — Execute gnome-help commands
- `gnome-help self version` — Print gnome-help version
- `gnome-help _ _` — Passthrough to gnome-help CLI

## Usage Examples
- "gnome-help --help"
- "gnome-help self version"

## Installation
```bash
apt-get install gnome-help 2>/dev/null || which gnome-help
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
