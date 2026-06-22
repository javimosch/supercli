---
name: pulseaudio
description: Use this skill when the user wants to use pulseaudio, cli tool: pulseaudio.
---

# pulseaudio Plugin

CLI tool: pulseaudio.

## Commands
- `pulseaudio <resource> <action>` — Execute pulseaudio commands
- `pulseaudio self version` — Print pulseaudio version
- `pulseaudio _ _` — Passthrough to pulseaudio CLI

## Usage Examples
- "pulseaudio --help"
- "pulseaudio self version"

## Installation
```bash
apt-get install pulseaudio 2>/dev/null || which pulseaudio
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
