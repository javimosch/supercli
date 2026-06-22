---
name: useradd
description: Use this skill when the user wants to use useradd, cli tool: useradd.
---

# useradd Plugin

CLI tool: useradd.

## Commands
- `useradd <resource> <action>` — Execute useradd commands
- `useradd self version` — Print useradd version
- `useradd _ _` — Passthrough to useradd CLI

## Usage Examples
- "useradd --help"
- "useradd self version"

## Installation
```bash
apt-get install useradd 2>/dev/null || which useradd
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
