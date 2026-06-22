---
name: systemd-stdio-bridge
description: Use this skill when the user wants to use systemd-stdio-bridge, cli tool: systemd-stdio-bridge.
---

# systemd-stdio-bridge Plugin

CLI tool: systemd-stdio-bridge.

## Commands
- `systemd-stdio-bridge <resource> <action>` — Execute systemd-stdio-bridge commands
- `systemd-stdio-bridge self version` — Print systemd-stdio-bridge version
- `systemd-stdio-bridge _ _` — Passthrough to systemd-stdio-bridge CLI

## Usage Examples
- "systemd-stdio-bridge --help"
- "systemd-stdio-bridge self version"

## Installation
```bash
apt-get install systemd-stdio-bridge 2>/dev/null || which systemd-stdio-bridge
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
