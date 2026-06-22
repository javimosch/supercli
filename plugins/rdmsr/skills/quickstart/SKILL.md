---
name: rdmsr
description: Use this skill when the user wants to use rdmsr, cli tool: rdmsr.
---

# rdmsr Plugin

CLI tool: rdmsr.

## Commands
- `rdmsr <resource> <action>` — Execute rdmsr commands
- `rdmsr self version` — Print rdmsr version
- `rdmsr _ _` — Passthrough to rdmsr CLI

## Usage Examples
- "rdmsr --help"
- "rdmsr self version"

## Installation
```bash
apt-get install rdmsr 2>/dev/null || which rdmsr
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
