---
name: pidwait
description: Use this skill when the user wants to use pidwait, cli tool: pidwait.
---

# pidwait Plugin

CLI tool: pidwait.

## Commands
- `pidwait <resource> <action>` — Execute pidwait commands
- `pidwait self version` — Print pidwait version
- `pidwait _ _` — Passthrough to pidwait CLI

## Usage Examples
- "pidwait --help"
- "pidwait self version"

## Installation
```bash
apt-get install pidwait 2>/dev/null || which pidwait
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
