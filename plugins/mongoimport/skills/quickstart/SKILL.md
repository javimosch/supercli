---
name: mongoimport
description: Use this skill when the user wants to use mongoimport, cli tool: mongoimport.
---

# mongoimport Plugin

CLI tool: mongoimport.

## Commands
- `mongoimport <resource> <action>` — Execute mongoimport commands
- `mongoimport self version` — Print mongoimport version
- `mongoimport _ _` — Passthrough to mongoimport CLI

## Usage Examples
- "mongoimport --help"
- "mongoimport self version"

## Installation
```bash
apt-get install mongoimport 2>/dev/null || which mongoimport
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
