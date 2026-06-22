---
name: pkexec
description: Use this skill when the user wants to use pkexec, cli tool: pkexec.
---

# pkexec Plugin

CLI tool: pkexec.

## Commands
- `pkexec <resource> <action>` — Execute pkexec commands
- `pkexec self version` — Print pkexec version
- `pkexec _ _` — Passthrough to pkexec CLI

## Usage Examples
- "pkexec --help"
- "pkexec self version"

## Installation
```bash
apt-get install pkexec 2>/dev/null || which pkexec
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
