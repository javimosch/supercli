---
name: update-leap
description: Use this skill when the user wants to use update-leap, cli tool: update-leap.
---

# update-leap Plugin

CLI tool: update-leap.

## Commands
- `update-leap <resource> <action>` — Execute update-leap commands
- `update-leap self version` — Print update-leap version
- `update-leap _ _` — Passthrough to update-leap CLI

## Usage Examples
- "update-leap --help"
- "update-leap self version"

## Installation
```bash
apt-get install update-leap 2>/dev/null || which update-leap
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
