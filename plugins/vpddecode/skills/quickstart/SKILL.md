---
name: vpddecode
description: Use this skill when the user wants to use vpddecode, SMBIOS/DMI table decoder.
---

# vpddecode Plugin

vpddecode — SMBIOS/DMI table decoder.

## Commands
- `vpddecode <resource> <action>` — Execute vpddecode commands
- `vpddecode self version` — Print vpddecode version
- `vpddecode _ _` — Passthrough to vpddecode CLI

## Usage Examples
- "vpddecode --help"
- "vpddecode self version"

## Installation
```bash
apt-get install dmidecode 2>/dev/null || which vpddecode
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
