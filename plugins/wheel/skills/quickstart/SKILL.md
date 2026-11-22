---
name: wheel
description: Use this skill when the user wants to use wheel, built-package format for Python (command-line scripts).
---

# wheel Plugin

wheel — built-package format for Python (command-line scripts).

## Commands
- `wheel <resource> <action>` — Execute wheel commands
- `wheel self version` — Print wheel version
- `wheel _ _` — Passthrough to wheel CLI

## Usage Examples
- "wheel --help"
- "wheel self version"

## Installation
```bash
apt-get install python-wheel-common 2>/dev/null || which wheel
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
