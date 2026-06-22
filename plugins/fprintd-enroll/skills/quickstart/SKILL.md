---
name: fprintd-enroll
description: Use this skill when the user wants to use fprintd-enroll, cli tool: fprintd-enroll.
---

# fprintd-enroll Plugin

CLI tool: fprintd-enroll.

## Commands
- `fprintd-enroll <resource> <action>` — Execute fprintd-enroll commands
- `fprintd-enroll self version` — Print fprintd-enroll version
- `fprintd-enroll _ _` — Passthrough to fprintd-enroll CLI

## Usage Examples
- "fprintd-enroll --help"
- "fprintd-enroll self version"

## Installation
```bash
apt-get install fprintd-enroll 2>/dev/null || which fprintd-enroll
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
