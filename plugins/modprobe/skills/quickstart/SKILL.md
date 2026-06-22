---
name: modprobe
description: Use this skill when the user wants to use modprobe, cli tool: modprobe.
---

# modprobe Plugin

CLI tool: modprobe.

## Commands
- `modprobe <resource> <action>` — Execute modprobe commands
- `modprobe self version` — Print modprobe version
- `modprobe _ _` — Passthrough to modprobe CLI

## Usage Examples
- "modprobe --help"
- "modprobe self version"

## Installation
```bash
apt-get install modprobe 2>/dev/null || which modprobe
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
