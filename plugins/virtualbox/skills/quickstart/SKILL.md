---
name: virtualbox
description: Use this skill when the user wants to use virtualbox, cli tool: virtualbox.
---

# virtualbox Plugin

CLI tool: virtualbox.

## Commands
- `virtualbox <resource> <action>` — Execute virtualbox commands
- `virtualbox self version` — Print virtualbox version
- `virtualbox _ _` — Passthrough to virtualbox CLI

## Usage Examples
- "virtualbox --help"
- "virtualbox self version"

## Installation
```bash
apt-get install virtualbox 2>/dev/null || which virtualbox
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
