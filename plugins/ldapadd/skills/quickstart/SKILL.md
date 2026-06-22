---
name: ldapadd
description: Use this skill when the user wants to use ldapadd, cli tool: ldapadd.
---

# ldapadd Plugin

CLI tool: ldapadd.

## Commands
- `ldapadd <resource> <action>` — Execute ldapadd commands
- `ldapadd self version` — Print ldapadd version
- `ldapadd _ _` — Passthrough to ldapadd CLI

## Usage Examples
- "ldapadd --help"
- "ldapadd self version"

## Installation
```bash
apt-get install ldapadd 2>/dev/null || which ldapadd
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
