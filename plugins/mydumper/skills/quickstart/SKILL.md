---
name: mydumper
description: Use this skill when the user wants to use mydumper, cli tool: mydumper.
---

# mydumper Plugin

CLI tool: mydumper.

## Commands
- `mydumper <resource> <action>` — Execute mydumper commands
- `mydumper self version` — Print mydumper version
- `mydumper _ _` — Passthrough to mydumper CLI

## Usage Examples
- "mydumper --help"
- "mydumper self version"

## Installation
```bash
apt-get install mydumper 2>/dev/null || which mydumper
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
