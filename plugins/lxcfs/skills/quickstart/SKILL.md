---
name: lxcfs
description: Use this skill when the user wants to use lxcfs, cli tool: lxcfs.
---

# lxcfs Plugin

CLI tool: lxcfs.

## Commands
- `lxcfs <resource> <action>` — Execute lxcfs commands
- `lxcfs self version` — Print lxcfs version
- `lxcfs _ _` — Passthrough to lxcfs CLI

## Usage Examples
- "lxcfs --help"
- "lxcfs self version"

## Installation
```bash
apt-get install lxcfs 2>/dev/null || which lxcfs
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
