---
name: ldapsearch
description: Use this skill when the user wants to use ldapsearch, cli tool: ldapsearch.
---

# ldapsearch Plugin

CLI tool: ldapsearch.

## Commands
- `ldapsearch <resource> <action>` — Execute ldapsearch commands
- `ldapsearch self version` — Print ldapsearch version
- `ldapsearch _ _` — Passthrough to ldapsearch CLI

## Usage Examples
- "ldapsearch --help"
- "ldapsearch self version"

## Installation
```bash
apt-get install ldapsearch 2>/dev/null || which ldapsearch
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
