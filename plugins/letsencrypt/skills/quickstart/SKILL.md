---
name: letsencrypt
description: Use this skill when the user wants to use letsencrypt, cli tool: letsencrypt.
---

# letsencrypt Plugin

CLI tool: letsencrypt.

## Commands
- `letsencrypt <resource> <action>` — Execute letsencrypt commands
- `letsencrypt self version` — Print letsencrypt version
- `letsencrypt _ _` — Passthrough to letsencrypt CLI

## Usage Examples
- "letsencrypt --help"
- "letsencrypt self version"

## Installation
```bash
apt-get install letsencrypt 2>/dev/null || which letsencrypt
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
