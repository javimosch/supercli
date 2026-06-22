---
name: secret-tool
description: Use this skill when the user wants to use secret-tool, cli tool: secret-tool.
---

# secret-tool Plugin

CLI tool: secret-tool.

## Commands
- `secret-tool <resource> <action>` — Execute secret-tool commands
- `secret-tool self version` — Print secret-tool version
- `secret-tool _ _` — Passthrough to secret-tool CLI

## Usage Examples
- "secret-tool --help"
- "secret-tool self version"

## Installation
```bash
apt-get install secret-tool 2>/dev/null || which secret-tool
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
