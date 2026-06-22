---
name: thin_dump
description: Use this skill when the user wants to use thin_dump, cli tool: thin_dump.
---

# thin_dump Plugin

CLI tool: thin_dump.

## Commands
- `thin_dump <resource> <action>` — Execute thin_dump commands
- `thin_dump self version` — Print thin_dump version
- `thin_dump _ _` — Passthrough to thin_dump CLI

## Usage Examples
- "thin_dump --help"
- "thin_dump self version"

## Installation
```bash
apt-get install thin_dump 2>/dev/null || which thin_dump
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
