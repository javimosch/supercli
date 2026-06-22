---
name: fprintd-verify
description: Use this skill when the user wants to use fprintd-verify, cli tool: fprintd-verify.
---

# fprintd-verify Plugin

CLI tool: fprintd-verify.

## Commands
- `fprintd-verify <resource> <action>` — Execute fprintd-verify commands
- `fprintd-verify self version` — Print fprintd-verify version
- `fprintd-verify _ _` — Passthrough to fprintd-verify CLI

## Usage Examples
- "fprintd-verify --help"
- "fprintd-verify self version"

## Installation
```bash
apt-get install fprintd-verify 2>/dev/null || which fprintd-verify
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
