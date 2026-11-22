---
name: vfyserv
description: Use this skill when the user wants to use vfyserv, Network Security Service tools.
---

# vfyserv Plugin

vfyserv — Network Security Service tools.

## Commands
- `vfyserv <resource> <action>` — Execute vfyserv commands
- `vfyserv self version` — Print vfyserv version
- `vfyserv _ _` — Passthrough to vfyserv CLI

## Usage Examples
- "vfyserv --help"
- "vfyserv self version"

## Installation
```bash
apt-get install libnss3-tools 2>/dev/null || which vfyserv
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
