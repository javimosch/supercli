---
name: thin_ls
description: Use this skill when the user wants to use thin_ls, cli tool: thin_ls.
---

# thin_ls Plugin

CLI tool: thin_ls.

## Commands
- `thin_ls <resource> <action>` — Execute thin_ls commands
- `thin_ls self version` — Print thin_ls version
- `thin_ls _ _` — Passthrough to thin_ls CLI

## Usage Examples
- "thin_ls --help"
- "thin_ls self version"

## Installation
```bash
apt-get install thin_ls 2>/dev/null || which thin_ls
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
