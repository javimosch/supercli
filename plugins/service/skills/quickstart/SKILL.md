---
name: service
description: Use this skill when the user wants to use service, cli tool: service.
---

# service Plugin

CLI tool: service.

## Commands
- `service <resource> <action>` — Execute service commands
- `service self version` — Print service version
- `service _ _` — Passthrough to service CLI

## Usage Examples
- "service --help"
- "service self version"

## Installation
```bash
apt-get install service 2>/dev/null || which service
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
