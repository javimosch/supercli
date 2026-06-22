---
name: unix_chkpwd
description: Use this skill when the user wants to use unix_chkpwd, cli tool: unix_chkpwd.
---

# unix_chkpwd Plugin

CLI tool: unix_chkpwd.

## Commands
- `unix_chkpwd <resource> <action>` — Execute unix_chkpwd commands
- `unix_chkpwd self version` — Print unix_chkpwd version
- `unix_chkpwd _ _` — Passthrough to unix_chkpwd CLI

## Usage Examples
- "unix_chkpwd --help"
- "unix_chkpwd self version"

## Installation
```bash
apt-get install unix_chkpwd 2>/dev/null || which unix_chkpwd
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
