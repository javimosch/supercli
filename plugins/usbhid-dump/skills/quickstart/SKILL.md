---
name: usbhid-dump
description: Use this skill when the user wants to use usbhid-dump, cli tool: usbhid-dump.
---

# usbhid-dump Plugin

CLI tool: usbhid-dump.

## Commands
- `usbhid-dump <resource> <action>` — Execute usbhid-dump commands
- `usbhid-dump self version` — Print usbhid-dump version
- `usbhid-dump _ _` — Passthrough to usbhid-dump CLI

## Usage Examples
- "usbhid-dump --help"
- "usbhid-dump self version"

## Installation
```bash
apt-get install usbhid-dump 2>/dev/null || which usbhid-dump
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
