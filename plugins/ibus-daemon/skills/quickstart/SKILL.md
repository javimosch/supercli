---
name: ibus-daemon
description: Use this skill when the user wants to use ibus-daemon, cli tool: ibus-daemon.
---

# ibus-daemon Plugin

CLI tool: ibus-daemon.

## Commands
- `ibus-daemon <resource> <action>` — Execute ibus-daemon commands
- `ibus-daemon self version` — Print ibus-daemon version
- `ibus-daemon _ _` — Passthrough to ibus-daemon CLI

## Usage Examples
- "ibus-daemon --help"
- "ibus-daemon self version"

## Installation
```bash
apt-get install ibus-daemon 2>/dev/null || which ibus-daemon
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
