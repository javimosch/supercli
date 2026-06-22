---
name: kvm-spice
description: Use this skill when the user wants to use kvm-spice, cli tool: kvm-spice.
---

# kvm-spice Plugin

CLI tool: kvm-spice.

## Commands
- `kvm-spice <resource> <action>` — Execute kvm-spice commands
- `kvm-spice self version` — Print kvm-spice version
- `kvm-spice _ _` — Passthrough to kvm-spice CLI

## Usage Examples
- "kvm-spice --help"
- "kvm-spice self version"

## Installation
```bash
apt-get install kvm-spice 2>/dev/null || which kvm-spice
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
