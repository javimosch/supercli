---
name: update-alternatives
description: Use this skill when the user wants to use update-alternatives, cli tool: update-alternatives.
---

# update-alternatives Plugin

CLI tool: update-alternatives.

## Commands
- `update-alternatives <resource> <action>` — Execute update-alternatives commands
- `update-alternatives self version` — Print update-alternatives version
- `update-alternatives _ _` — Passthrough to update-alternatives CLI

## Usage Examples
- "update-alternatives --help"
- "update-alternatives self version"

## Installation
```bash
apt-get install update-alternatives 2>/dev/null || which update-alternatives
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
