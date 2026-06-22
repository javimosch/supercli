---
name: fprintd-list
description: Use this skill when the user wants to use fprintd-list, cli tool: fprintd-list.
---

# fprintd-list Plugin

CLI tool: fprintd-list.

## Commands
- `fprintd-list <resource> <action>` — Execute fprintd-list commands
- `fprintd-list self version` — Print fprintd-list version
- `fprintd-list _ _` — Passthrough to fprintd-list CLI

## Usage Examples
- "fprintd-list --help"
- "fprintd-list self version"

## Installation
```bash
apt-get install fprintd-list 2>/dev/null || which fprintd-list
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
