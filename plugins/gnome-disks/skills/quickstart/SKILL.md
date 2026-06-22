---
name: gnome-disks
description: Use this skill when the user wants to use gnome-disks, cli tool: gnome-disks.
---

# gnome-disks Plugin

CLI tool: gnome-disks.

## Commands
- `gnome-disks <resource> <action>` — Execute gnome-disks commands
- `gnome-disks self version` — Print gnome-disks version
- `gnome-disks _ _` — Passthrough to gnome-disks CLI

## Usage Examples
- "gnome-disks --help"
- "gnome-disks self version"

## Installation
```bash
apt-get install gnome-disks 2>/dev/null || which gnome-disks
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
