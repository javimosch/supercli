---
name: vstp
description: Use this skill when the user wants to use vstp, Access software for a blind person using a braille display.
---

# vstp Plugin

vstp — Access software for a blind person using a braille display.

## Commands
- `vstp <resource> <action>` — Execute vstp commands
- `vstp self version` — Print vstp version
- `vstp _ _` — Passthrough to vstp CLI

## Usage Examples
- "vstp --help"
- "vstp self version"

## Installation
```bash
apt-get install brltty 2>/dev/null || which vstp
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
