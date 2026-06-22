---
name: plymouth
description: Use this skill when the user wants to use plymouth, cli tool: plymouth.
---

# plymouth Plugin

CLI tool: plymouth.

## Commands
- `plymouth <resource> <action>` — Execute plymouth commands
- `plymouth self version` — Print plymouth version
- `plymouth _ _` — Passthrough to plymouth CLI

## Usage Examples
- "plymouth --help"
- "plymouth self version"

## Installation
```bash
apt-get install plymouth 2>/dev/null || which plymouth
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
