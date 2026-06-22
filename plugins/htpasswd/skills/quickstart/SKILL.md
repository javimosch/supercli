---
name: htpasswd
description: Use this skill when the user wants to use htpasswd, cli tool: htpasswd.
---

# htpasswd Plugin

CLI tool: htpasswd.

## Commands
- `htpasswd <resource> <action>` — Execute htpasswd commands
- `htpasswd self version` — Print htpasswd version
- `htpasswd _ _` — Passthrough to htpasswd CLI

## Usage Examples
- "htpasswd --help"
- "htpasswd self version"

## Installation
```bash
apt-get install htpasswd 2>/dev/null || which htpasswd
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
