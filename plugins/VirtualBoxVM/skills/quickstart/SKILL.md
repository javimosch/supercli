---
name: VirtualBoxVM
description: Use this skill when the user wants to use VirtualBoxVM, cli tool: virtualboxvm.
---

# VirtualBoxVM Plugin

CLI tool: VirtualBoxVM.

## Commands
- `VirtualBoxVM <resource> <action>` — Execute VirtualBoxVM commands
- `VirtualBoxVM self version` — Print VirtualBoxVM version
- `VirtualBoxVM _ _` — Passthrough to VirtualBoxVM CLI

## Usage Examples
- "VirtualBoxVM --help"
- "VirtualBoxVM self version"

## Installation
```bash
apt-get install VirtualBoxVM 2>/dev/null || which VirtualBoxVM
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
