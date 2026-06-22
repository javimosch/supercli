---
name: lvscan
description: Use this skill when the user wants to use lvscan, cli tool: lvscan.
---

# lvscan Plugin

CLI tool: lvscan.

## Commands
- `lvscan <resource> <action>` — Execute lvscan commands
- `lvscan self version` — Print lvscan version
- `lvscan _ _` — Passthrough to lvscan CLI

## Usage Examples
- "lvscan --help"
- "lvscan self version"

## Installation
```bash
apt-get install lvscan 2>/dev/null || which lvscan
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
