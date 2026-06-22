---
name: ldappasswd
description: Use this skill when the user wants to use ldappasswd, cli tool: ldappasswd.
---

# ldappasswd Plugin

CLI tool: ldappasswd.

## Commands
- `ldappasswd <resource> <action>` — Execute ldappasswd commands
- `ldappasswd self version` — Print ldappasswd version
- `ldappasswd _ _` — Passthrough to ldappasswd CLI

## Usage Examples
- "ldappasswd --help"
- "ldappasswd self version"

## Installation
```bash
apt-get install ldappasswd 2>/dev/null || which ldappasswd
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
