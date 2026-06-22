---
name: ldapmodify
description: Use this skill when the user wants to use ldapmodify, cli tool: ldapmodify.
---

# ldapmodify Plugin

CLI tool: ldapmodify.

## Commands
- `ldapmodify <resource> <action>` — Execute ldapmodify commands
- `ldapmodify self version` — Print ldapmodify version
- `ldapmodify _ _` — Passthrough to ldapmodify CLI

## Usage Examples
- "ldapmodify --help"
- "ldapmodify self version"

## Installation
```bash
apt-get install ldapmodify 2>/dev/null || which ldapmodify
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
