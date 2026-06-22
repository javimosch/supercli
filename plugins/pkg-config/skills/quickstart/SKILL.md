---
name: pkg-config
description: Use this skill when the user wants to use pkg-config, cli tool: pkg-config.
---

# pkg-config Plugin

CLI tool: pkg-config.

## Commands
- `pkg-config <resource> <action>` — Execute pkg-config commands
- `pkg-config self version` — Print pkg-config version
- `pkg-config _ _` — Passthrough to pkg-config CLI

## Usage Examples
- "pkg-config --help"
- "pkg-config self version"

## Installation
```bash
apt-get install pkg-config 2>/dev/null || which pkg-config
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
