---
name: nsupdate
description: Use this skill when the user wants to use nsupdate, cli tool: nsupdate.
---

# nsupdate Plugin

CLI tool: nsupdate.

## Commands
- `nsupdate <resource> <action>` — Execute nsupdate commands
- `nsupdate self version` — Print nsupdate version
- `nsupdate _ _` — Passthrough to nsupdate CLI

## Usage Examples
- "nsupdate --help"
- "nsupdate self version"

## Installation
```bash
apt-get install nsupdate 2>/dev/null || which nsupdate
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
