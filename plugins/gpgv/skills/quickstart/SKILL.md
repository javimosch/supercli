---
name: gpgv
description: Use this skill when the user wants to use gpgv, cli tool: gpgv.
---

# gpgv Plugin

CLI tool: gpgv.

## Commands
- `gpgv <resource> <action>` — Execute gpgv commands
- `gpgv self version` — Print gpgv version
- `gpgv _ _` — Passthrough to gpgv CLI

## Usage Examples
- "gpgv --help"
- "gpgv self version"

## Installation
```bash
apt-get install gpgv 2>/dev/null || which gpgv
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
