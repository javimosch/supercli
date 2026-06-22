---
name: tailscaled
description: Use this skill when the user wants to use tailscaled, cli tool: tailscaled.
---

# tailscaled Plugin

CLI tool: tailscaled.

## Commands
- `tailscaled <resource> <action>` — Execute tailscaled commands
- `tailscaled self version` — Print tailscaled version
- `tailscaled _ _` — Passthrough to tailscaled CLI

## Usage Examples
- "tailscaled --help"
- "tailscaled self version"

## Installation
```bash
apt-get install tailscaled 2>/dev/null || which tailscaled
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
