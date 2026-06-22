---
name: utmpdump
description: Use this skill when the user wants to use utmpdump, cli tool: utmpdump.
---

# utmpdump Plugin

CLI tool: utmpdump.

## Commands
- `utmpdump <resource> <action>` — Execute utmpdump commands
- `utmpdump self version` — Print utmpdump version
- `utmpdump _ _` — Passthrough to utmpdump CLI

## Usage Examples
- "utmpdump --help"
- "utmpdump self version"

## Installation
```bash
apt-get install utmpdump 2>/dev/null || which utmpdump
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
