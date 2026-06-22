---
name: fwupdagent
description: Use this skill when the user wants to use fwupdagent, cli tool: fwupdagent.
---

# fwupdagent Plugin

CLI tool: fwupdagent.

## Commands
- `fwupdagent <resource> <action>` — Execute fwupdagent commands
- `fwupdagent self version` — Print fwupdagent version
- `fwupdagent _ _` — Passthrough to fwupdagent CLI

## Usage Examples
- "fwupdagent --help"
- "fwupdagent self version"

## Installation
```bash
apt-get install fwupdagent 2>/dev/null || which fwupdagent
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
