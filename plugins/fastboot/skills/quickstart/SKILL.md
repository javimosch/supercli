---
name: fastboot
description: Use this skill when the user wants to use fastboot, cli tool: fastboot.
---

# fastboot Plugin

CLI tool: fastboot.

## Commands
- `fastboot <resource> <action>` — Execute fastboot commands
- `fastboot self version` — Print fastboot version
- `fastboot _ _` — Passthrough to fastboot CLI

## Usage Examples
- "fastboot --help"
- "fastboot self version"

## Installation
```bash
apt-get install fastboot 2>/dev/null || which fastboot
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
