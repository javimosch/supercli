---
name: notify-send
description: Use this skill when the user wants to use notify-send, cli tool: notify-send.
---

# notify-send Plugin

CLI tool: notify-send.

## Commands
- `notify-send <resource> <action>` — Execute notify-send commands
- `notify-send self version` — Print notify-send version
- `notify-send _ _` — Passthrough to notify-send CLI

## Usage Examples
- "notify-send --help"
- "notify-send self version"

## Installation
```bash
apt-get install notify-send 2>/dev/null || which notify-send
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
