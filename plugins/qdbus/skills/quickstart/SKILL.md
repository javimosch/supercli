---
name: qdbus
description: Use this skill when the user wants to use qdbus, cli tool: qdbus.
---

# qdbus Plugin

CLI tool: qdbus.

## Commands
- `qdbus <resource> <action>` — Execute qdbus commands
- `qdbus self version` — Print qdbus version
- `qdbus _ _` — Passthrough to qdbus CLI

## Usage Examples
- "qdbus --help"
- "qdbus self version"

## Installation
```bash
apt-get install qdbus 2>/dev/null || which qdbus
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
