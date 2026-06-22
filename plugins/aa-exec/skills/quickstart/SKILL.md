---
name: aa-exec
description: Use this skill when the user wants to use aa-exec, cli tool: aa-exec.
---

# aa-exec Plugin

CLI tool: aa-exec.

## Commands
- `aa-exec <resource> <action>` — Execute aa-exec commands
- `aa-exec self version` — Print aa-exec version
- `aa-exec _ _` — Passthrough to aa-exec CLI

## Usage Examples
- "aa-exec --help"
- "aa-exec self version"

## Installation
```bash
apt-get install aa-exec 2>/dev/null || which aa-exec
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
