---
name: vmwarectrl
description: Use this skill when the user wants to use vmwarectrl, X.Org X server -- VMware display driver.
---

# vmwarectrl Plugin

vmwarectrl — X.Org X server -- VMware display driver.

## Commands
- `vmwarectrl <resource> <action>` — Execute vmwarectrl commands
- `vmwarectrl self version` — Print vmwarectrl version
- `vmwarectrl _ _` — Passthrough to vmwarectrl CLI

## Usage Examples
- "vmwarectrl --help"
- "vmwarectrl self version"

## Installation
```bash
apt-get install xserver-xorg-video-vmware 2>/dev/null || which vmwarectrl
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
