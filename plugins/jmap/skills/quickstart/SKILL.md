---
name: jmap
description: Use this skill when the user wants to use jmap, cli tool: jmap.
---

# jmap Plugin

CLI tool: jmap.

## Commands
- `jmap <resource> <action>` — Execute jmap commands
- `jmap self version` — Print jmap version
- `jmap _ _` — Passthrough to jmap CLI

## Usage Examples
- "jmap --help"
- "jmap self version"

## Installation
```bash
apt-get install jmap 2>/dev/null || which jmap
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
