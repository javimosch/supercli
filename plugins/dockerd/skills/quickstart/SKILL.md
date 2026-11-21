---
name: dockerd
description: Use this skill when the user wants to use dockerd, Linux container runtime.
---

# dockerd Plugin

dockerd — Linux container runtime.

## Commands
- `dockerd <resource> <action>` — Execute dockerd commands
- `dockerd self version` — Print dockerd version
- `dockerd _ _` — Passthrough to dockerd CLI

## Usage Examples
- "dockerd --help"
- "dockerd self version"

## Installation
```bash
apt-get install docker.io 2>/dev/null || which dockerd
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
