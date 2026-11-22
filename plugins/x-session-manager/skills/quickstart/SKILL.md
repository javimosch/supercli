---
name: x-session-manager
description: Use this skill when the user wants to use x-session-manager, Plasma Workspace for KF5.
---

# x-session-manager Plugin

x-session-manager — Plasma Workspace for KF5.

## Commands
- `x-session-manager <resource> <action>` — Execute x-session-manager commands
- `x-session-manager self version` — Print x-session-manager version
- `x-session-manager _ _` — Passthrough to x-session-manager CLI

## Usage Examples
- "x-session-manager --help"
- "x-session-manager self version"

## Installation
```bash
apt-get install plasma-workspace 2>/dev/null || which x-session-manager
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
