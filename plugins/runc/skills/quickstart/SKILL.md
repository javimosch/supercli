---
name: runc
description: Use this skill when the user wants to use runc, cli tool: runc.
---

# runc Plugin

CLI tool: runc.

## Commands
- `runc <resource> <action>` — Execute runc commands
- `runc self version` — Print runc version
- `runc _ _` — Passthrough to runc CLI

## Usage Examples
- "runc --help"
- "runc self version"

## Installation
```bash
apt-get install runc 2>/dev/null || which runc
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
