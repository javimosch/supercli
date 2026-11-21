---
name: who
description: Use this skill when the user wants to use who, GNU core utilities.
---

# who Plugin

who — GNU core utilities.

## Commands
- `who <resource> <action>` — Execute who commands
- `who self version` — Print who version
- `who _ _` — Passthrough to who CLI

## Usage Examples
- "who --help"
- "who self version"

## Installation
```bash
apt-get install coreutils 2>/dev/null || which who
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
