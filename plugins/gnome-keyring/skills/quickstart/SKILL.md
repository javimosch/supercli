---
name: gnome-keyring
description: Use this skill when the user wants to use gnome-keyring, cli tool: gnome-keyring.
---

# gnome-keyring Plugin

CLI tool: gnome-keyring.

## Commands
- `gnome-keyring <resource> <action>` — Execute gnome-keyring commands
- `gnome-keyring self version` — Print gnome-keyring version
- `gnome-keyring _ _` — Passthrough to gnome-keyring CLI

## Usage Examples
- "gnome-keyring --help"
- "gnome-keyring self version"

## Installation
```bash
apt-get install gnome-keyring 2>/dev/null || which gnome-keyring
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
