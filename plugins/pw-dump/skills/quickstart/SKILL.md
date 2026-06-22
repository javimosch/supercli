---
name: pw-dump
description: Use this skill when the user wants to use pw-dump, cli tool: pw-dump.
---

# pw-dump Plugin

CLI tool: pw-dump.

## Commands
- `pw-dump <resource> <action>` — Execute pw-dump commands
- `pw-dump self version` — Print pw-dump version
- `pw-dump _ _` — Passthrough to pw-dump CLI

## Usage Examples
- "pw-dump --help"
- "pw-dump self version"

## Installation
```bash
apt-get install pw-dump 2>/dev/null || which pw-dump
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
