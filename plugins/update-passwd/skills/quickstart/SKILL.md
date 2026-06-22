---
name: update-passwd
description: Use this skill when the user wants to use update-passwd, cli tool: update-passwd.
---

# update-passwd Plugin

CLI tool: update-passwd.

## Commands
- `update-passwd <resource> <action>` — Execute update-passwd commands
- `update-passwd self version` — Print update-passwd version
- `update-passwd _ _` — Passthrough to update-passwd CLI

## Usage Examples
- "update-passwd --help"
- "update-passwd self version"

## Installation
```bash
apt-get install update-passwd 2>/dev/null || which update-passwd
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
