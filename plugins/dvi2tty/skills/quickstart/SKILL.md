---
name: dvi2tty
description: Use this skill when the user wants to use dvi2tty, Binaries for TeX Live.
---

# dvi2tty Plugin

dvi2tty — Binaries for TeX Live.

## Commands
- `dvi2tty <resource> <action>` — Execute dvi2tty commands
- `dvi2tty self version` — Print dvi2tty version
- `dvi2tty _ _` — Passthrough to dvi2tty CLI

## Usage Examples
- "dvi2tty --help"
- "dvi2tty self version"

## Installation
```bash
apt-get install texlive-binaries 2>/dev/null || which dvi2tty
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
