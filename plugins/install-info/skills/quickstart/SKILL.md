---
name: install-info
description: Use this skill when the user wants to use install-info, cli tool: install-info.
---

# install-info Plugin

CLI tool: install-info.

## Commands
- `install-info <resource> <action>` — Execute install-info commands
- `install-info self version` — Print install-info version
- `install-info _ _` — Passthrough to install-info CLI

## Usage Examples
- "install-info --help"
- "install-info self version"

## Installation
```bash
apt-get install install-info 2>/dev/null || which install-info
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
