---
name: zrun
description: Use this skill when the user wants to use zrun, additional Unix utilities.
---

# zrun Plugin

zrun — additional Unix utilities.

## Commands
- `zrun <resource> <action>` — Execute zrun commands
- `zrun self version` — Print zrun version
- `zrun _ _` — Passthrough to zrun CLI

## Usage Examples
- "zrun --help"
- "zrun self version"

## Installation
```bash
apt-get install moreutils 2>/dev/null || which zrun
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
