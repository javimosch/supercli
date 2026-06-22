---
name: pavucontrol
description: Use this skill when the user wants to use pavucontrol, cli tool: pavucontrol.
---

# pavucontrol Plugin

CLI tool: pavucontrol.

## Commands
- `pavucontrol <resource> <action>` — Execute pavucontrol commands
- `pavucontrol self version` — Print pavucontrol version
- `pavucontrol _ _` — Passthrough to pavucontrol CLI

## Usage Examples
- "pavucontrol --help"
- "pavucontrol self version"

## Installation
```bash
apt-get install pavucontrol 2>/dev/null || which pavucontrol
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
