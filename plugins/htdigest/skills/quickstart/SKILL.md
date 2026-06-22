---
name: htdigest
description: Use this skill when the user wants to use htdigest, cli tool: htdigest.
---

# htdigest Plugin

CLI tool: htdigest.

## Commands
- `htdigest <resource> <action>` — Execute htdigest commands
- `htdigest self version` — Print htdigest version
- `htdigest _ _` — Passthrough to htdigest CLI

## Usage Examples
- "htdigest --help"
- "htdigest self version"

## Installation
```bash
apt-get install htdigest 2>/dev/null || which htdigest
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
