---
name: dockerd-rootless.sh
description: Use this skill when the user wants to use dockerd-rootless.sh, cli tool: dockerd-rootless.sh.
---

# dockerd-rootless.sh Plugin

CLI tool: dockerd-rootless.sh.

## Commands
- `dockerd-rootless.sh <resource> <action>` — Execute dockerd-rootless.sh commands
- `dockerd-rootless.sh self version` — Print dockerd-rootless.sh version
- `dockerd-rootless.sh _ _` — Passthrough to dockerd-rootless.sh CLI

## Usage Examples
- "dockerd-rootless.sh --help"
- "dockerd-rootless.sh self version"

## Installation
```bash
apt-get install dockerd-rootless.sh 2>/dev/null || which dockerd-rootless.sh
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
