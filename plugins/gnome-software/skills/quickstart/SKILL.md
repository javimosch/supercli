---
name: gnome-software
description: Use this skill when the user wants to use gnome-software, cli tool: gnome-software.
---

# gnome-software Plugin

CLI tool: gnome-software.

## Commands
- `gnome-software <resource> <action>` — Execute gnome-software commands
- `gnome-software self version` — Print gnome-software version
- `gnome-software _ _` — Passthrough to gnome-software CLI

## Usage Examples
- "gnome-software --help"
- "gnome-software self version"

## Installation
```bash
apt-get install gnome-software 2>/dev/null || which gnome-software
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
