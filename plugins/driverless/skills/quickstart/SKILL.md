---
name: driverless
description: Use this skill when the user wants to use driverless, OpenPrinting CUPS Filters - Driverless printing.
---

# driverless Plugin

driverless — OpenPrinting CUPS Filters - Driverless printing.

## Commands
- `driverless <resource> <action>` — Execute driverless commands
- `driverless self version` — Print driverless version
- `driverless _ _` — Passthrough to driverless CLI

## Usage Examples
- "driverless --help"
- "driverless self version"

## Installation
```bash
apt-get install cups-filters-core-drivers 2>/dev/null || which driverless
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
