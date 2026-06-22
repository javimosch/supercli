---
name: start-stop-daemon
description: Use this skill when the user wants to use start-stop-daemon, cli tool: start-stop-daemon.
---

# start-stop-daemon Plugin

CLI tool: start-stop-daemon.

## Commands
- `start-stop-daemon <resource> <action>` — Execute start-stop-daemon commands
- `start-stop-daemon self version` — Print start-stop-daemon version
- `start-stop-daemon _ _` — Passthrough to start-stop-daemon CLI

## Usage Examples
- "start-stop-daemon --help"
- "start-stop-daemon self version"

## Installation
```bash
apt-get install start-stop-daemon 2>/dev/null || which start-stop-daemon
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
