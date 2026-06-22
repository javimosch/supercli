---
name: kvm
description: Use this skill when the user wants to use kvm, cli tool: kvm.
---

# kvm Plugin

CLI tool: kvm.

## Commands
- `kvm <resource> <action>` — Execute kvm commands
- `kvm self version` — Print kvm version
- `kvm _ _` — Passthrough to kvm CLI

## Usage Examples
- "kvm --help"
- "kvm self version"

## Installation
```bash
apt-get install kvm 2>/dev/null || which kvm
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
