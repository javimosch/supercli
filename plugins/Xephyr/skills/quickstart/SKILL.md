---
name: Xephyr
description: Use this skill when the user wants to use Xephyr, nested X server.
---

# Xephyr Plugin

Xephyr — nested X server.

## Commands
- `Xephyr <resource> <action>` — Execute Xephyr commands
- `Xephyr self version` — Print Xephyr version
- `Xephyr _ _` — Passthrough to Xephyr CLI

## Usage Examples
- "Xephyr --help"
- "Xephyr self version"

## Installation
```bash
apt-get install xserver-xephyr 2>/dev/null || which Xephyr
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
