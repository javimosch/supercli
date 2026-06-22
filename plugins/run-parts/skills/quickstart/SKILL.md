---
name: run-parts
description: Use this skill when the user wants to use run-parts, cli tool: run-parts.
---

# run-parts Plugin

CLI tool: run-parts.

## Commands
- `run-parts <resource> <action>` — Execute run-parts commands
- `run-parts self version` — Print run-parts version
- `run-parts _ _` — Passthrough to run-parts CLI

## Usage Examples
- "run-parts --help"
- "run-parts self version"

## Installation
```bash
apt-get install run-parts 2>/dev/null || which run-parts
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
