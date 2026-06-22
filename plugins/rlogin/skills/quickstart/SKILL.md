---
name: rlogin
description: Use this skill when the user wants to use rlogin, cli tool: rlogin.
---

# rlogin Plugin

CLI tool: rlogin.

## Commands
- `rlogin <resource> <action>` — Execute rlogin commands
- `rlogin self version` — Print rlogin version
- `rlogin _ _` — Passthrough to rlogin CLI

## Usage Examples
- "rlogin --help"
- "rlogin self version"

## Installation
```bash
apt-get install rlogin 2>/dev/null || which rlogin
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
