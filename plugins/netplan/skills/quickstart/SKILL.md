---
name: netplan
description: Use this skill when the user wants to use netplan, cli tool: netplan.
---

# netplan Plugin

CLI tool: netplan.

## Commands
- `netplan <resource> <action>` — Execute netplan commands
- `netplan self version` — Print netplan version
- `netplan _ _` — Passthrough to netplan CLI

## Usage Examples
- "netplan --help"
- "netplan self version"

## Installation
```bash
apt-get install netplan 2>/dev/null || which netplan
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
