---
name: jcmd
description: Use this skill when the user wants to use jcmd, cli tool: jcmd.
---

# jcmd Plugin

CLI tool: jcmd.

## Commands
- `jcmd <resource> <action>` — Execute jcmd commands
- `jcmd self version` — Print jcmd version
- `jcmd _ _` — Passthrough to jcmd CLI

## Usage Examples
- "jcmd --help"
- "jcmd self version"

## Installation
```bash
apt-get install jcmd 2>/dev/null || which jcmd
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
