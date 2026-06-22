---
name: rcmd
description: Use this skill when the user wants to use rcmd, cli tool: rcmd.
---

# rcmd Plugin

CLI tool: rcmd.

## Commands
- `rcmd <resource> <action>` — Execute rcmd commands
- `rcmd self version` — Print rcmd version
- `rcmd _ _` — Passthrough to rcmd CLI

## Usage Examples
- "rcmd --help"
- "rcmd self version"

## Installation
```bash
apt-get install rcmd 2>/dev/null || which rcmd
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
