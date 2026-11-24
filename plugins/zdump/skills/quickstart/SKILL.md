---
name: zdump
description: Use this skill when the user wants to use zdump, GNU C Library: Binaries.
---

# zdump Plugin

zdump — GNU C Library: Binaries.

## Commands
- `zdump <resource> <action>` — Execute zdump commands
- `zdump self version` — Print zdump version
- `zdump _ _` — Passthrough to zdump CLI

## Usage Examples
- "zdump --help"
- "zdump self version"

## Installation
```bash
apt-get install libc-bin 2>/dev/null || which zdump
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
