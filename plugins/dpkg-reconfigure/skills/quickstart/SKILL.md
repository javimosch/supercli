---
name: dpkg-reconfigure
description: Use this skill when the user wants to use dpkg-reconfigure, Debian configuration management system.
---

# dpkg-reconfigure Plugin

dpkg-reconfigure — Debian configuration management system.

## Commands
- `dpkg-reconfigure <resource> <action>` — Execute dpkg-reconfigure commands
- `dpkg-reconfigure self version` — Print dpkg-reconfigure version
- `dpkg-reconfigure _ _` — Passthrough to dpkg-reconfigure CLI

## Usage Examples
- "dpkg-reconfigure --help"
- "dpkg-reconfigure self version"

## Installation
```bash
apt-get install debconf 2>/dev/null || which dpkg-reconfigure
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
