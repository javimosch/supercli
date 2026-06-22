---
name: libvirtd
description: Use this skill when the user wants to use libvirtd, cli tool: libvirtd.
---

# libvirtd Plugin

CLI tool: libvirtd.

## Commands
- `libvirtd <resource> <action>` — Execute libvirtd commands
- `libvirtd self version` — Print libvirtd version
- `libvirtd _ _` — Passthrough to libvirtd CLI

## Usage Examples
- "libvirtd --help"
- "libvirtd self version"

## Installation
```bash
apt-get install libvirtd 2>/dev/null || which libvirtd
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
