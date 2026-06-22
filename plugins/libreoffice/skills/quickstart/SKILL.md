---
name: libreoffice
description: Use this skill when the user wants to use libreoffice, cli tool: libreoffice.
---

# libreoffice Plugin

CLI tool: libreoffice.

## Commands
- `libreoffice <resource> <action>` — Execute libreoffice commands
- `libreoffice self version` — Print libreoffice version
- `libreoffice _ _` — Passthrough to libreoffice CLI

## Usage Examples
- "libreoffice --help"
- "libreoffice self version"

## Installation
```bash
apt-get install libreoffice 2>/dev/null || which libreoffice
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
