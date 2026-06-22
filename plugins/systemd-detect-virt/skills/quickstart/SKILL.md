---
name: systemd-detect-virt
description: Use this skill when the user wants to use systemd-detect-virt, cli tool: systemd-detect-virt.
---

# systemd-detect-virt Plugin

CLI tool: systemd-detect-virt.

## Commands
- `systemd-detect-virt <resource> <action>` — Execute systemd-detect-virt commands
- `systemd-detect-virt self version` — Print systemd-detect-virt version
- `systemd-detect-virt _ _` — Passthrough to systemd-detect-virt CLI

## Usage Examples
- "systemd-detect-virt --help"
- "systemd-detect-virt self version"

## Installation
```bash
apt-get install systemd-detect-virt 2>/dev/null || which systemd-detect-virt
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
