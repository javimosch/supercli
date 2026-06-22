---
name: hostnamectl
description: Use this skill when the user wants to use hostnamectl, cli tool: hostnamectl.
---

# hostnamectl Plugin

CLI tool: hostnamectl.

## Commands
- `hostnamectl <resource> <action>` — Execute hostnamectl commands
- `hostnamectl self version` — Print hostnamectl version
- `hostnamectl _ _` — Passthrough to hostnamectl CLI

## Usage Examples
- "hostnamectl --help"
- "hostnamectl self version"

## Installation
```bash
apt-get install hostnamectl 2>/dev/null || which hostnamectl
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
