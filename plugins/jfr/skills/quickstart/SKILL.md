---
name: jfr
description: Use this skill when the user wants to use jfr, cli tool: jfr.
---

# jfr Plugin

CLI tool: jfr.

## Commands
- `jfr <resource> <action>` — Execute jfr commands
- `jfr self version` — Print jfr version
- `jfr _ _` — Passthrough to jfr CLI

## Usage Examples
- "jfr --help"
- "jfr self version"

## Installation
```bash
apt-get install jfr 2>/dev/null || which jfr
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
