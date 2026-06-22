---
name: hp-doctor
description: Use this skill when the user wants to use hp-doctor, cli tool: hp-doctor.
---

# hp-doctor Plugin

CLI tool: hp-doctor.

## Commands
- `hp-doctor <resource> <action>` — Execute hp-doctor commands
- `hp-doctor self version` — Print hp-doctor version
- `hp-doctor _ _` — Passthrough to hp-doctor CLI

## Usage Examples
- "hp-doctor --help"
- "hp-doctor self version"

## Installation
```bash
apt-get install hp-doctor 2>/dev/null || which hp-doctor
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
