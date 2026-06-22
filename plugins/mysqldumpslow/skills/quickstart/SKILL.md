---
name: mysqldumpslow
description: Use this skill when the user wants to use mysqldumpslow, cli tool: mysqldumpslow.
---

# mysqldumpslow Plugin

CLI tool: mysqldumpslow.

## Commands
- `mysqldumpslow <resource> <action>` — Execute mysqldumpslow commands
- `mysqldumpslow self version` — Print mysqldumpslow version
- `mysqldumpslow _ _` — Passthrough to mysqldumpslow CLI

## Usage Examples
- "mysqldumpslow --help"
- "mysqldumpslow self version"

## Installation
```bash
apt-get install mysqldumpslow 2>/dev/null || which mysqldumpslow
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
