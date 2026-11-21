---
name: xdg-user-dirs-update
description: Use this skill when the user wants to use xdg-user-dirs-update, tool to manage well known user directories.
---

# xdg-user-dirs-update Plugin

xdg-user-dirs-update — tool to manage well known user directories.

## Commands
- `xdg-user-dirs-update <resource> <action>` — Execute xdg-user-dirs-update commands
- `xdg-user-dirs-update self version` — Print xdg-user-dirs-update version
- `xdg-user-dirs-update _ _` — Passthrough to xdg-user-dirs-update CLI

## Usage Examples
- "xdg-user-dirs-update --help"
- "xdg-user-dirs-update self version"

## Installation
```bash
apt-get install xdg-user-dirs 2>/dev/null || which xdg-user-dirs-update
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
