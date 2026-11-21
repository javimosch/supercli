---
name: wrmsr
description: Use this skill when the user wants to use wrmsr, Utilities for modifying MSRs from userspace.
---

# wrmsr Plugin

wrmsr — Utilities for modifying MSRs from userspace.

## Commands
- `wrmsr <resource> <action>` — Execute wrmsr commands
- `wrmsr self version` — Print wrmsr version
- `wrmsr _ _` — Passthrough to wrmsr CLI

## Usage Examples
- "wrmsr --help"
- "wrmsr self version"

## Installation
```bash
apt-get install msr-tools 2>/dev/null || which wrmsr
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
