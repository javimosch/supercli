---
name: hp-firmware
description: Use this skill when the user wants to use hp-firmware, cli tool: hp-firmware.
---

# hp-firmware Plugin

CLI tool: hp-firmware.

## Commands
- `hp-firmware <resource> <action>` — Execute hp-firmware commands
- `hp-firmware self version` — Print hp-firmware version
- `hp-firmware _ _` — Passthrough to hp-firmware CLI

## Usage Examples
- "hp-firmware --help"
- "hp-firmware self version"

## Installation
```bash
apt-get install hp-firmware 2>/dev/null || which hp-firmware
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
