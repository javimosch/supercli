---
name: gparted
description: Use this skill when the user wants to use gparted, cli tool: gparted.
---

# gparted Plugin

CLI tool: gparted.

## Commands
- `gparted <resource> <action>` — Execute gparted commands
- `gparted self version` — Print gparted version
- `gparted _ _` — Passthrough to gparted CLI

## Usage Examples
- "gparted --help"
- "gparted self version"

## Installation
```bash
apt-get install gparted 2>/dev/null || which gparted
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
