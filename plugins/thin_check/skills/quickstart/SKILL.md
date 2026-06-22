---
name: thin_check
description: Use this skill when the user wants to use thin_check, cli tool: thin_check.
---

# thin_check Plugin

CLI tool: thin_check.

## Commands
- `thin_check <resource> <action>` — Execute thin_check commands
- `thin_check self version` — Print thin_check version
- `thin_check _ _` — Passthrough to thin_check CLI

## Usage Examples
- "thin_check --help"
- "thin_check self version"

## Installation
```bash
apt-get install thin_check 2>/dev/null || which thin_check
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
