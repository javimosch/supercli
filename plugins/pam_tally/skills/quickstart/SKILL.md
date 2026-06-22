---
name: pam_tally
description: Use this skill when the user wants to use pam_tally, cli tool: pam_tally.
---

# pam_tally Plugin

CLI tool: pam_tally.

## Commands
- `pam_tally <resource> <action>` — Execute pam_tally commands
- `pam_tally self version` — Print pam_tally version
- `pam_tally _ _` — Passthrough to pam_tally CLI

## Usage Examples
- "pam_tally --help"
- "pam_tally self version"

## Installation
```bash
apt-get install pam_tally 2>/dev/null || which pam_tally
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
