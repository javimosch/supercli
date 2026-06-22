---
name: osinfo-query
description: Use this skill when the user wants to use osinfo-query, cli tool: osinfo-query.
---

# osinfo-query Plugin

CLI tool: osinfo-query.

## Commands
- `osinfo-query <resource> <action>` — Execute osinfo-query commands
- `osinfo-query self version` — Print osinfo-query version
- `osinfo-query _ _` — Passthrough to osinfo-query CLI

## Usage Examples
- "osinfo-query --help"
- "osinfo-query self version"

## Installation
```bash
apt-get install osinfo-query 2>/dev/null || which osinfo-query
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
