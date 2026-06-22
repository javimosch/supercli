---
name: kvm-ok
description: Use this skill when the user wants to use kvm-ok, cli tool: kvm-ok.
---

# kvm-ok Plugin

CLI tool: kvm-ok.

## Commands
- `kvm-ok <resource> <action>` — Execute kvm-ok commands
- `kvm-ok self version` — Print kvm-ok version
- `kvm-ok _ _` — Passthrough to kvm-ok CLI

## Usage Examples
- "kvm-ok --help"
- "kvm-ok self version"

## Installation
```bash
apt-get install kvm-ok 2>/dev/null || which kvm-ok
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
