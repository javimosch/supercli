---
name: gpasswd
description: Use this skill when the user wants to use gpasswd, cli tool: gpasswd.
---

# gpasswd Plugin

CLI tool: gpasswd.

## Commands
- `gpasswd <resource> <action>` — Execute gpasswd commands
- `gpasswd self version` — Print gpasswd version
- `gpasswd _ _` — Passthrough to gpasswd CLI

## Usage Examples
- "gpasswd --help"
- "gpasswd self version"

## Installation
```bash
apt-get install gpasswd 2>/dev/null || which gpasswd
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
