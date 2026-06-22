---
name: ntpq
description: Use this skill when the user wants to use ntpq, cli tool: ntpq.
---

# ntpq Plugin

CLI tool: ntpq.

## Commands
- `ntpq <resource> <action>` — Execute ntpq commands
- `ntpq self version` — Print ntpq version
- `ntpq _ _` — Passthrough to ntpq CLI

## Usage Examples
- "ntpq --help"
- "ntpq self version"

## Installation
```bash
apt-get install ntpq 2>/dev/null || which ntpq
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
