---
name: VirtualBox
description: Use this skill when the user wants to use VirtualBox, cli tool: virtualbox.
---

# VirtualBox Plugin

CLI tool: VirtualBox.

## Commands
- `VirtualBox <resource> <action>` — Execute VirtualBox commands
- `VirtualBox self version` — Print VirtualBox version
- `VirtualBox _ _` — Passthrough to VirtualBox CLI

## Usage Examples
- "VirtualBox --help"
- "VirtualBox self version"

## Installation
```bash
apt-get install VirtualBox 2>/dev/null || which VirtualBox
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
