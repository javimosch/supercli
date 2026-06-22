---
name: dpkg-preconfigure
description: Use this skill when the user wants to use dpkg-preconfigure, cli tool: dpkg-preconfigure.
---

# dpkg-preconfigure Plugin

CLI tool: dpkg-preconfigure.

## Commands
- `dpkg-preconfigure <resource> <action>` — Execute dpkg-preconfigure commands
- `dpkg-preconfigure self version` — Print dpkg-preconfigure version
- `dpkg-preconfigure _ _` — Passthrough to dpkg-preconfigure CLI

## Usage Examples
- "dpkg-preconfigure --help"
- "dpkg-preconfigure self version"

## Installation
```bash
apt-get install dpkg-preconfigure 2>/dev/null || which dpkg-preconfigure
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
