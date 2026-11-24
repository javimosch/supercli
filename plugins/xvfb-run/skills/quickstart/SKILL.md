---
name: xvfb-run
description: Use this skill when the user wants to use xvfb-run, Virtual Framebuffer 'fake' X server.
---

# xvfb-run Plugin

xvfb-run — Virtual Framebuffer 'fake' X server.

## Commands
- `xvfb-run <resource> <action>` — Execute xvfb-run commands
- `xvfb-run self version` — Print xvfb-run version
- `xvfb-run _ _` — Passthrough to xvfb-run CLI

## Usage Examples
- "xvfb-run --help"
- "xvfb-run self version"

## Installation
```bash
apt-get install xvfb 2>/dev/null || which xvfb-run
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
