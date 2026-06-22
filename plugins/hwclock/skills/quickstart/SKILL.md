---
name: hwclock
description: Use this skill when the user wants to use hwclock, cli tool: hwclock.
---

# hwclock Plugin

CLI tool: hwclock.

## Commands
- `hwclock <resource> <action>` — Execute hwclock commands
- `hwclock self version` — Print hwclock version
- `hwclock _ _` — Passthrough to hwclock CLI

## Usage Examples
- "hwclock --help"
- "hwclock self version"

## Installation
```bash
apt-get install hwclock 2>/dev/null || which hwclock
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
