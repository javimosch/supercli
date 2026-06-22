---
name: simple-scan
description: Use this skill when the user wants to use simple-scan, cli tool: simple-scan.
---

# simple-scan Plugin

CLI tool: simple-scan.

## Commands
- `simple-scan <resource> <action>` — Execute simple-scan commands
- `simple-scan self version` — Print simple-scan version
- `simple-scan _ _` — Passthrough to simple-scan CLI

## Usage Examples
- "simple-scan --help"
- "simple-scan self version"

## Installation
```bash
apt-get install simple-scan 2>/dev/null || which simple-scan
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
