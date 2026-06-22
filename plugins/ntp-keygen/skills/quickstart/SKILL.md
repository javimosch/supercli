---
name: ntp-keygen
description: Use this skill when the user wants to use ntp-keygen, cli tool: ntp-keygen.
---

# ntp-keygen Plugin

CLI tool: ntp-keygen.

## Commands
- `ntp-keygen <resource> <action>` — Execute ntp-keygen commands
- `ntp-keygen self version` — Print ntp-keygen version
- `ntp-keygen _ _` — Passthrough to ntp-keygen CLI

## Usage Examples
- "ntp-keygen --help"
- "ntp-keygen self version"

## Installation
```bash
apt-get install ntp-keygen 2>/dev/null || which ntp-keygen
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
