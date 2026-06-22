---
name: usbipd
description: Use this skill when the user wants to use usbipd, cli tool: usbipd.
---

# usbipd Plugin

CLI tool: usbipd.

## Commands
- `usbipd <resource> <action>` — Execute usbipd commands
- `usbipd self version` — Print usbipd version
- `usbipd _ _` — Passthrough to usbipd CLI

## Usage Examples
- "usbipd --help"
- "usbipd self version"

## Installation
```bash
apt-get install usbipd 2>/dev/null || which usbipd
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
