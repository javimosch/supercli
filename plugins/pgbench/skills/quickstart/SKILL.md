---
name: pgbench
description: Use this skill when the user wants to use pgbench, cli tool: pgbench.
---

# pgbench Plugin

CLI tool: pgbench.

## Commands
- `pgbench <resource> <action>` — Execute pgbench commands
- `pgbench self version` — Print pgbench version
- `pgbench _ _` — Passthrough to pgbench CLI

## Usage Examples
- "pgbench --help"
- "pgbench self version"

## Installation
```bash
apt-get install pgbench 2>/dev/null || which pgbench
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
