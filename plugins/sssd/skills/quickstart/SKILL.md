---
name: sssd
description: Use this skill when the user wants to use sssd, cli tool: sssd.
---

# sssd Plugin

CLI tool: sssd.

## Commands
- `sssd <resource> <action>` — Execute sssd commands
- `sssd self version` — Print sssd version
- `sssd _ _` — Passthrough to sssd CLI

## Usage Examples
- "sssd --help"
- "sssd self version"

## Installation
```bash
apt-get install sssd 2>/dev/null || which sssd
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
