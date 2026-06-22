---
name: soffice
description: Use this skill when the user wants to use soffice, cli tool: soffice.
---

# soffice Plugin

CLI tool: soffice.

## Commands
- `soffice <resource> <action>` — Execute soffice commands
- `soffice self version` — Print soffice version
- `soffice _ _` — Passthrough to soffice CLI

## Usage Examples
- "soffice --help"
- "soffice self version"

## Installation
```bash
apt-get install soffice 2>/dev/null || which soffice
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
