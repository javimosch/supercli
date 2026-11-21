---
name: calibrate_ppa
description: Use this skill when the user wants to use calibrate_ppa, printer driver for HP-GDI printers.
---

# calibrate_ppa Plugin

calibrate_ppa — printer driver for HP-GDI printers.

## Commands
- `calibrate_ppa <resource> <action>` — Execute calibrate_ppa commands
- `calibrate_ppa self version` — Print calibrate_ppa version
- `calibrate_ppa _ _` — Passthrough to calibrate_ppa CLI

## Usage Examples
- "calibrate_ppa --help"
- "calibrate_ppa self version"

## Installation
```bash
apt-get install printer-driver-pnm2ppa 2>/dev/null || which calibrate_ppa
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
