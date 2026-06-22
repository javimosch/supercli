---
name: fwupdmgr
description: Use this skill when the user wants to use fwupdmgr, cli tool: fwupdmgr.
---

# fwupdmgr Plugin

CLI tool: fwupdmgr.

## Commands
- `fwupdmgr <resource> <action>` — Execute fwupdmgr commands
- `fwupdmgr self version` — Print fwupdmgr version
- `fwupdmgr _ _` — Passthrough to fwupdmgr CLI

## Usage Examples
- "fwupdmgr --help"
- "fwupdmgr self version"

## Installation
```bash
apt-get install fwupdmgr 2>/dev/null || which fwupdmgr
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
