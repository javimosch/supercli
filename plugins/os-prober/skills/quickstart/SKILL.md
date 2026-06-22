---
name: os-prober
description: Use this skill when the user wants to use os-prober, cli tool: os-prober.
---

# os-prober Plugin

CLI tool: os-prober.

## Commands
- `os-prober <resource> <action>` — Execute os-prober commands
- `os-prober self version` — Print os-prober version
- `os-prober _ _` — Passthrough to os-prober CLI

## Usage Examples
- "os-prober --help"
- "os-prober self version"

## Installation
```bash
apt-get install os-prober 2>/dev/null || which os-prober
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
