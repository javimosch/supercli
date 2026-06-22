---
name: faillog
description: Use this skill when the user wants to use faillog, cli tool: faillog.
---

# faillog Plugin

CLI tool: faillog.

## Commands
- `faillog <resource> <action>` — Execute faillog commands
- `faillog self version` — Print faillog version
- `faillog _ _` — Passthrough to faillog CLI

## Usage Examples
- "faillog --help"
- "faillog self version"

## Installation
```bash
apt-get install faillog 2>/dev/null || which faillog
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
