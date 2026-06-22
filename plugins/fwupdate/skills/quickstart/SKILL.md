---
name: fwupdate
description: Use this skill when the user wants to use fwupdate, cli tool: fwupdate.
---

# fwupdate Plugin

CLI tool: fwupdate.

## Commands
- `fwupdate <resource> <action>` — Execute fwupdate commands
- `fwupdate self version` — Print fwupdate version
- `fwupdate _ _` — Passthrough to fwupdate CLI

## Usage Examples
- "fwupdate --help"
- "fwupdate self version"

## Installation
```bash
apt-get install fwupdate 2>/dev/null || which fwupdate
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
