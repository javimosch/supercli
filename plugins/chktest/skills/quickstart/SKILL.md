---
name: chktest
description: Use this skill when the user wants to use chktest, Network Security Service tools.
---

# chktest Plugin

chktest — Network Security Service tools.

## Commands
- `chktest <resource> <action>` — Execute chktest commands
- `chktest self version` — Print chktest version
- `chktest _ _` — Passthrough to chktest CLI

## Usage Examples
- "chktest --help"
- "chktest self version"

## Installation
```bash
apt-get install libnss3-tools 2>/dev/null || which chktest
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
