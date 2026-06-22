---
name: NetworkManager
description: Use this skill when the user wants to use NetworkManager, cli tool: networkmanager.
---

# NetworkManager Plugin

CLI tool: NetworkManager.

## Commands
- `NetworkManager <resource> <action>` — Execute NetworkManager commands
- `NetworkManager self version` — Print NetworkManager version
- `NetworkManager _ _` — Passthrough to NetworkManager CLI

## Usage Examples
- "NetworkManager --help"
- "NetworkManager self version"

## Installation
```bash
apt-get install NetworkManager 2>/dev/null || which NetworkManager
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
