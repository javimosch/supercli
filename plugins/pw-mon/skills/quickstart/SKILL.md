---
name: pw-mon
description: Use this skill when the user wants to use pw-mon, cli tool: pw-mon.
---

# pw-mon Plugin

CLI tool: pw-mon.

## Commands
- `pw-mon <resource> <action>` — Execute pw-mon commands
- `pw-mon self version` — Print pw-mon version
- `pw-mon _ _` — Passthrough to pw-mon CLI

## Usage Examples
- "pw-mon --help"
- "pw-mon self version"

## Installation
```bash
apt-get install pw-mon 2>/dev/null || which pw-mon
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
