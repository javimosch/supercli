---
name: wayland-scanner
description: Use this skill when the user wants to use wayland-scanner, cli tool: wayland-scanner.
---

# wayland-scanner Plugin

CLI tool: wayland-scanner.

## Commands
- `wayland-scanner <resource> <action>` — Execute wayland-scanner commands
- `wayland-scanner self version` — Print wayland-scanner version
- `wayland-scanner _ _` — Passthrough to wayland-scanner CLI

## Usage Examples
- "wayland-scanner --help"
- "wayland-scanner self version"

## Installation
```bash
apt-get install wayland-scanner 2>/dev/null || which wayland-scanner
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
