---
name: lwp-dump
description: Use this skill when the user wants to use lwp-dump, cli tool: lwp-dump.
---

# lwp-dump Plugin

CLI tool: lwp-dump.

## Commands
- `lwp-dump <resource> <action>` — Execute lwp-dump commands
- `lwp-dump self version` — Print lwp-dump version
- `lwp-dump _ _` — Passthrough to lwp-dump CLI

## Usage Examples
- "lwp-dump --help"
- "lwp-dump self version"

## Installation
```bash
apt-get install lwp-dump 2>/dev/null || which lwp-dump
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
