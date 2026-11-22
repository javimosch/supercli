---
name: Xwayland
description: Use this skill when the user wants to use Xwayland, X server for running X clients under Wayland.
---

# Xwayland Plugin

Xwayland — X server for running X clients under Wayland.

## Commands
- `Xwayland <resource> <action>` — Execute Xwayland commands
- `Xwayland self version` — Print Xwayland version
- `Xwayland _ _` — Passthrough to Xwayland CLI

## Usage Examples
- "Xwayland --help"
- "Xwayland self version"

## Installation
```bash
apt-get install xwayland 2>/dev/null || which Xwayland
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
