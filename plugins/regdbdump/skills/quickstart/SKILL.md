---
name: regdbdump
description: Use this skill when the user wants to use regdbdump, cli tool: regdbdump.
---

# regdbdump Plugin

CLI tool: regdbdump.

## Commands
- `regdbdump <resource> <action>` — Execute regdbdump commands
- `regdbdump self version` — Print regdbdump version
- `regdbdump _ _` — Passthrough to regdbdump CLI

## Usage Examples
- "regdbdump --help"
- "regdbdump self version"

## Installation
```bash
apt-get install regdbdump 2>/dev/null || which regdbdump
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
